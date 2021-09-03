// Package handlers contains the full set of handler functions and routes
// supported by the web api.
package handlers

import (
	"context"
	"encoding/json"
	"expvar"
	"github.com/algorand/go-algorand-sdk/client/v2/algod"
	"github.com/algorand/go-algorand-sdk/client/v2/indexer"
	"github.com/go-kivik/kivik/v4"
	"github.com/kevguy/algosearch/backend/business/couchdata/block"
	"github.com/kevguy/algosearch/backend/business/couchdata/transaction"
	"github.com/kevguy/algosearch/backend/business/sys/auth"
	"go.uber.org/zap"
	"net/http"
	"net/http/pprof"
	"os"

	"github.com/kevguy/algosearch/backend/business/sys/metrics"
	"github.com/kevguy/algosearch/backend/business/web/mid"
	"github.com/kevguy/algosearch/backend/foundation/web"
)

// Options represent optional parameters.
type Options struct {
	corsOrigin string
}

// WithCORS provides configuration options for CORS.
func WithCORS(origin string) func(opts *Options) {
	return func(opts *Options) {
		opts.corsOrigin = origin
	}
}

// DebugStandardLibraryMux registers all the debug routes from the standard library
// into a new mux bypassing the use of the DefaultServerMux. Using the
// DefaultServerMux would be a security risk since a dependency could inject a
// handler into our service without us knowing it.
func DebugStandardLibraryMux() *http.ServeMux {
	mux := http.NewServeMux()

	// Register all the standard library debug endpoints.
	mux.HandleFunc("/debug/pprof/", pprof.Index)
	mux.HandleFunc("/debug/pprof/cmdline", pprof.Cmdline)
	mux.HandleFunc("/debug/pprof/profile", pprof.Profile)
	mux.HandleFunc("/debug/pprof/symbol", pprof.Symbol)
	mux.HandleFunc("/debug/pprof/trace", pprof.Trace)
	mux.Handle("/debug/vars", expvar.Handler())

	return mux
}

// DebugMux registers all the debug standard library routes and then custom
// debug application routes for the service. This bypassing the use of the
// DefaultServerMux. Using the DefaultServerMux would be a security risk since
// a dependency could inject a handler into our service without us knowing it.
func DebugMux(build string, log *zap.SugaredLogger) http.Handler {
	mux := DebugStandardLibraryMux()

	// Register debug check endpoints.
	cg := checkGroup{
		build: build,
		log:   log,
	}
	mux.HandleFunc("/debug/readiness", cg.readiness)
	mux.HandleFunc("/debug/liveness", cg.liveness)

	return mux
}

// APIMuxConfig contains all the mandatory systems required by handlers.
type APIMuxConfig struct {
	Shutdown chan os.Signal
	Log				*zap.SugaredLogger
	Metrics			*metrics.Metrics
	Auth			*auth.Auth
	AlgodClient		*algod.Client
	IndexerClient	*indexer.Client
	CouchClient		*kivik.Client
}

// APIMux constructs an http.Handler with all application routes defined.
func APIMux(cfg APIMuxConfig, options ...func(opts *Options)) http.Handler {
	var opts Options
	for _, option := range options {
		option(&opts)
	}

	// Construct the web.App which holds all routes as well as common Middleware.
	app := web.NewApp(
		cfg.Shutdown,
		mid.Logger(cfg.Log),
		mid.Errors(cfg.Log),
		mid.Metrics(cfg.Metrics),
		mid.Panics(),
	)

	h := func(ctx context.Context, w http.ResponseWriter, r *http.Request) error {
		status := struct {
			Status string
		}{
			Status: "OK",
		}
		json.NewEncoder(w).Encode(status)
		return nil
	}

	app.Handle(http.MethodGet, "/", h)
	app.Handle(http.MethodGet, "/test", h)

	// Register round endpoints
	rG := roundGroup{
		log: cfg.Log,
		store: block.NewStore(cfg.Log, cfg.CouchClient),
		algodClient: cfg.AlgodClient,
	}
	app.Handle(http.MethodGet, "/v1/algod/current-round", rG.getCurrentRoundFromAPI)
	app.Handle(http.MethodGet, "/v1/algod/rounds/:num", rG.getRoundFromAPI)
	app.Handle(http.MethodGet, "/v1/current-round", rG.getLatestSyncedRound)
	app.Handle(http.MethodGet, "/v1/earliest-round", rG.getEarliestSyncedRound)
	app.Handle(http.MethodGet, "/v1/round/:num", rG.getRound)
	app.Handle(http.MethodGet, "/v1/rounds", rG.getRoundsPagination)

	tG := transactionGroup{
		log: cfg.Log,
		store: transaction.NewStore(cfg.Log, cfg.CouchClient),
		algodClient: cfg.AlgodClient,
	}
	app.Handle(http.MethodGet, "/v1/current-txn", tG.getLatestSyncedTransaction)
	app.Handle(http.MethodGet, "/v1/earliest-txn", tG.getEarliestSyncedTransaction)
	app.Handle(http.MethodGet, "/v1/transaction/:num", tG.getTransaction)
	app.Handle(http.MethodGet, "/v1/transactions", tG.getTransactionsPagination)

	// Accept CORS 'OPTIONS' preflight requests if config has been provided.
	// Don't forget to apply the CORS middleware to the routes that need it.
	// Example Config: `conf:"default:https://MY_DOMAIN.COM"`
	if opts.corsOrigin != "" {
		h := func(ctx context.Context, w http.ResponseWriter, r *http.Request) error {
			return nil
		}
		app.Handle(http.MethodOptions, "/*", h)
	}

	return app
}
