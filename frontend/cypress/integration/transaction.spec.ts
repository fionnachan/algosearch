import { backend_url, commonIntercepts, stubWebSocketToInSync } from '../support/utils';
const txAcfgFixture = '../fixtures/tx/tx_acfg.json';
const txAfrzFixture = '../fixtures/tx/tx_afrz.json';
const txApprovalFixture = '../fixtures/tx/tx_appl_approval.json';
const txInnerTxsFixture = '../fixtures/tx/tx_appl_inner_txs_2.json';
const txAxferFixture = '../fixtures/tx/tx_axfer.json';
const txKeyregFixture = '../fixtures/tx/tx_keyreg.json';
const txLsigFixture = '../fixtures/tx/tx_pay_logicSig.json';
const txMsigFixture = '../fixtures/tx/tx_pay_multi.json';

describe('Transaction Page', () => {
  beforeEach(() => {
    commonIntercepts();

    stubWebSocketToInSync();
  });

  /* General, with Payment Tx with Single Sig */
  it('displays tx info correctly', () => {
    cy.visit('/tx/NTIU26TLJ6XMMBV6YQJB6SUPG5FBKCMHG2EQ5R5AGJDQ7OXK7PKQ');
    cy.wait('@getTx');

    cy.get('[class*="Block_block-table"]').eq(0).find('tbody tr').as('mainTable');
    cy.get('@mainTable').eq(0).children().eq(0).should('have.text', 'ID');
    cy.get('@mainTable').eq(0).children().eq(1).should('have.text', 'NTIU26TLJ6XMMBV6YQJB6SUPG5FBKCMHG2EQ5R5AGJDQ7OXK7PKQ');
    cy.get('@mainTable').eq(1).children().eq(0).should('have.text', 'Block');
    cy.get('@mainTable').eq(1).children().eq(1).should('have.text', '6,611,812');
    cy.get('@mainTable').eq(2).children().eq(0).should('have.text', 'Type');
    cy.get('@mainTable').eq(2).children().eq(1).should('have.text', 'Payment');
    cy.get('@mainTable').eq(3).children().eq(0).should('have.text', 'Sender');
    cy.get('@mainTable').eq(3).children().eq(1).should('have.text', 'TKEVVXMEEBRZQG5PP6CPJTHNK3MVHPTRA5M3ATER5GIL36EAPUMX5MR37U');
    cy.get('@mainTable').eq(4).children().eq(0).should('have.text', 'Receiver');
    cy.get('@mainTable').eq(4).children().eq(1).should('have.text', 'SP745JJR4KPRQEXJZHVIEN736LYTL2T2DFMG3OIIFJBV66K73PHNMDCZVM');
    cy.get('@mainTable').eq(5).children().eq(0).should('have.text', 'Amount');
    cy.get('@mainTable').eq(5).children().eq(1).should('contain', '28,883.027883');
    cy.get('@mainTable').eq(6).children().eq(0).should('have.text', 'Fee');
    cy.get('@mainTable').eq(6).children().eq(1).should('contain', '0.001');
  });

  it('displays notes in 4 versions', () => {
    cy.visit('/tx/NTIU26TLJ6XMMBV6YQJB6SUPG5FBKCMHG2EQ5R5AGJDQ7OXK7PKQ');
    cy.wait('@getTx');

    cy.get('[class*="Block_block-table"]').eq(0).find('tbody tr').eq(8).children().eq(0).should('have.text', 'Note');
    cy.get('[class*="Block_block-table"]').eq(0).find('tbody tr').eq(8).children().eq(1).as('noteTab');
    cy.get('@noteTab').find('.TabUnstyled-root').eq(0).should('have.text', 'Base64');
    cy.get('@noteTab').find('.TabUnstyled-root').eq(1).should('have.text', 'ASCII');
    cy.get('@noteTab').find('.TabUnstyled-root').eq(2).should('have.text', 'UInt64');
    cy.get('@noteTab').find('.TabUnstyled-root').eq(3).should('have.text', 'MessagePack');
    cy.get('@noteTab').find('.TabPanelUnstyled-root').eq(0).should('have.text', 'FszNghkCXmo=');
    cy.get('@noteTab').find('.TabUnstyled-root').eq(1).click();
    cy.get('@noteTab').find('.TabPanelUnstyled-root').eq(1).should('have.text', '\u0016ÌÍ\u0019\u0002^j');
    cy.get('@noteTab').find('.TabUnstyled-root').eq(2).click();
    cy.get('@noteTab').find('.TabPanelUnstyled-root').eq(2).find('[class*="TransactionDetails_notes-row"] div:first-child h5').should('have.text', 'Hexadecimal');
    cy.get('@noteTab').find('.TabPanelUnstyled-root').eq(2).find('[class*="TransactionDetails_notes-row"] div:first-child span').should('have.text', '16cccd8219025e6a');
    cy.get('@noteTab').find('.TabPanelUnstyled-root').eq(2).find('[class*="TransactionDetails_notes-row"] div:last-child h5').should('have.text', 'Decimal');
    cy.get('@noteTab').find('.TabPanelUnstyled-root').eq(2).find('[class*="TransactionDetails_notes-row"] div:last-child span').should('have.text', '1642913922732416618');
    cy.get('@noteTab').find('.TabUnstyled-root').eq(3).click();
    cy.get('@noteTab').find('.TabPanelUnstyled-root').eq(3).should('have.text', '22');
  });

  it('clicking Block ID navigates to block page', () => {
    cy.visit('/tx/NTIU26TLJ6XMMBV6YQJB6SUPG5FBKCMHG2EQ5R5AGJDQ7OXK7PKQ');
    cy.wait('@getTx');
    cy.get('[class*="Block_block-table"] tbody tr').eq(1).children().eq(1).children('a').click();
    cy.url().should('include', '/block/');
  });

  it('clicking Sender navigates to address page', () => {
    cy.visit('/tx/NTIU26TLJ6XMMBV6YQJB6SUPG5FBKCMHG2EQ5R5AGJDQ7OXK7PKQ');
    cy.wait('@getTx');
    cy.get('[class*="Block_block-table"] tbody tr').eq(3).children().eq(1).children('a').click();
    cy.url().should('include', '/address/');
  });

  it('clicking Receiver navigates to address page', () => {
    cy.visit('/tx/NTIU26TLJ6XMMBV6YQJB6SUPG5FBKCMHG2EQ5R5AGJDQ7OXK7PKQ');
    cy.wait('@getTx');
    cy.get('[class*="Block_block-table"] tbody tr').eq(4).children().eq(1).children('a').click();
    cy.url().should('include', '/address/');
  });

  it('displays Additional Info correctly', () => {
    cy.visit('/tx/NTIU26TLJ6XMMBV6YQJB6SUPG5FBKCMHG2EQ5R5AGJDQ7OXK7PKQ');
    cy.wait('@getTx');
    cy.get('[class*="Block_block-table"]').eq(1).find('tbody tr').as('addInfoTable');
    cy.get('@addInfoTable').eq(0).children().eq(0).should('have.text', 'First Valid');
    cy.get('@addInfoTable').eq(0).children().eq(1).should('have.text', '6,611,809');
    cy.get('@addInfoTable').eq(1).children().eq(0).should('have.text', 'Last Valid');
    cy.get('@addInfoTable').eq(1).children().eq(1).should('have.text', '6,612,809');
    cy.get('@addInfoTable').eq(2).children().eq(0).should('have.text', 'Confirmed Round');
    cy.get('@addInfoTable').eq(2).children().eq(1).should('have.text', '6,611,812');
    cy.get('@addInfoTable').eq(3).children().eq(0).should('have.text', 'Sender Rewards');
    cy.get('@addInfoTable').eq(3).children().eq(1).should('contain', '0.028883');
    cy.get('@addInfoTable').eq(4).children().eq(0).should('have.text', 'Receiver Rewards');
    cy.get('@addInfoTable').eq(4).children().eq(1).should('contain', '0');
    cy.get('@addInfoTable').eq(5).children().eq(0).should('have.text', 'Genesis ID');
    cy.get('@addInfoTable').eq(5).children().eq(1).should('have.text', 'mainnet-v1.0');
    cy.get('@addInfoTable').eq(6).children().eq(0).should('have.text', 'Genesis Hash');
    cy.get('@addInfoTable').eq(6).children().eq(1).should('have.text', 'wGHE2Pwdvd7S12BL5FaOP20EGYesN73ktiC1qzkkit8=');
  });

  /* Asset Config Tx */
  /* Asset Freeze Tx */
  /* Asset Transfer Tx */
  /* Asset KeyReg Tx */
  /* App Call Tx with Approval Program and Clear State Program */
  it('displays App Call Tx with Approval Program and Clear State Program info correctly', () => {
    cy.intercept(
      {
        method: 'GET',
        url: `${backend_url}/v1/transactions/*`,
      },
      {
        fixture: txApprovalFixture,
      },
    ).as('getApprovalTx');
    cy.visit('/tx/NTIU26TLJ6XMMBV6YQJB6SUPG5FBKCMHG2EQ5R5AGJDQ7OXK7PKQ');
    cy.wait('@getApprovalTx');

    cy.get('[class*="Block_block-table"]').eq(0).find('tbody tr').as('appCallMainTable');
    cy.get('@appCallMainTable').eq(0).children().eq(0).should('have.text', 'Group ID');
    cy.get('@appCallMainTable').eq(0).children().eq(1).should('have.text', 'TwOfuW94Nd0hXrKfpSXcwD80DE7v1copZN8NZfQM67M=');
    cy.get('@appCallMainTable').eq(1).children().eq(0).should('have.text', 'ID');
    cy.get('@appCallMainTable').eq(1).children().eq(1).should('have.text', '3FLI5PVGYIHV7RXMW5M4VFVIIRQOZFMFELYGFL6FCEQUNOEAVD7Q');
    cy.get('@appCallMainTable').eq(2).children().eq(0).should('have.text', 'Block');
    cy.get('@appCallMainTable').eq(2).children().eq(1).should('have.text', '19,193,933');
    cy.get('@appCallMainTable').eq(3).children().eq(0).should('have.text', 'Type');
    cy.get('@appCallMainTable').eq(3).children().eq(1).should('have.text', 'App Call');
    cy.get('@appCallMainTable').eq(4).children().eq(0).should('have.text', 'Sender');
    cy.get('@appCallMainTable').eq(4).children().eq(1).should('have.text', 'MIZ3P3RZEXYT4VHRRT6K5EBYQKP24SLHBPXMADKKDZ3VCLVXOOKUACN42E');
    cy.get('@appCallMainTable').eq(5).children().eq(0).should('have.text', 'Fee');
    cy.get('@appCallMainTable').eq(5).children().eq(1).should('contain', '0.001');

    /* App Call Tx Info */
    cy.get('[class*="Block_block-table"]').eq(1).children('table').children('tbody').children('tr').as('appTxInfoTableRows');

    cy.get('@appTxInfoTableRows').eq(0).children().eq(0).should('have.text', 'Application ID');
    cy.get('@appTxInfoTableRows').eq(0).children().eq(1).should('have.text', '0');
    cy.get('@appTxInfoTableRows').eq(1).children().eq(0).should('have.text', 'Accounts');
    cy.get('@appTxInfoTableRows').eq(1).children().eq(1).should('have.text', 'N/A');
    cy.get('@appTxInfoTableRows').eq(2).children().eq(0).should('have.text', 'Arguments');
    cy.get('@appTxInfoTableRows').eq(2).children().eq(1).find('[class*="TransactionDetails_inner-table"]').as('appArgsTable');
    cy.get('@appArgsTable').find('thead td').eq(0).should('have.text', 'Base64');
    cy.get('@appArgsTable').find('thead td').eq(1).should('have.text', 'ASCII');
    cy.get('@appArgsTable').find('thead td').eq(2).should('have.text', 'UInt64');
    cy.get('@appArgsTable').find('tbody td').eq(0).should('have.text', 'Y3JlYXRl');
    cy.get('@appArgsTable').find('tbody td').eq(1).should('have.text', 'create');
    cy.get('@appArgsTable').find('tbody td').eq(2).should('have.text', '109342978307173');
    cy.get('@appTxInfoTableRows').eq(3).children().eq(0).should('have.text', 'On Completion');
    cy.get('@appTxInfoTableRows').eq(3).children().eq(1).should('have.text', 'noop');
    cy.get('@appTxInfoTableRows').eq(4).children().eq(0).should('have.text', 'Created Application Index');
    cy.get('@appTxInfoTableRows').eq(4).children().eq(1).should('have.text', '62368684');
    cy.get('@appTxInfoTableRows').eq(5).children().eq(0).should('have.text', 'Global State Schema');
    cy.get('@appTxInfoTableRows').eq(5).children().eq(1).should('contain', 'Number of byte-slice: 0');
    cy.get('@appTxInfoTableRows').eq(5).children().eq(1).should('contain', 'Number of uint: 0');
    cy.get('@appTxInfoTableRows').eq(6).children().eq(0).should('have.text', 'Local State Schema');
    cy.get('@appTxInfoTableRows').eq(6).children().eq(1).should('contain', 'Number of byte-slice: 0');
    cy.get('@appTxInfoTableRows').eq(6).children().eq(1).should('contain', 'Number of uint: 16');
    cy.get('@appTxInfoTableRows').eq(7).children().eq(0).should('have.text', 'Approval Program');
    cy.get('@appTxInfoTableRows').eq(7).children().eq(1).as('approvalTab');
    cy.get('@approvalTab').find('.TabUnstyled-root').eq(0).should('have.text', 'TEAL');
    cy.get('@approvalTab').find('.TabUnstyled-root').eq(1).should('have.text', 'Base64');
    cy.get('@approvalTab').find('.TabUnstyled-root').eq(1).click();
    cy.get('@approvalTab')
      .find('.TabPanelUnstyled-root')
      .eq(1)
      .should(
        'have.text',
        'BCAHAAHoB+UHBf///////////wHAhD0mDQFvAWUBcAJhMQJhMgJsdARzd2FwBG1pbnQBdAJjMQJwMQJjMgJwMjEZgQQSMRkhBBIRMRmBAhIRQATxMRkjEjEbIhIQQATjNhoAgAZjcmVhdGUSQATUMRkjEjYaAIAJYm9vdHN0cmFwEhBAA/MzAhIzAggINTQiK2I1ZSI0ZXAARDUBIicEYjVmNGZAABEiYCJ4CTEBCDMACAk1AkIACCI0ZnAARDUCIicFYjVnKDRlFlA1byI0b2I1PSg0ZhZQNXAiNHBiNT4oNGcWUDVxIjRxYjU/IipiNUA0ATQ9CTVHNAI0Pgk1SDEAKVA0ZRZQNXkxAClQNGYWUDV6MQApUDRnFlA1ezYaAIAGcmVkZWVtEkAAWjYaAIAEZmVlcxJAABw2GgAnBhI2GgAnBxIRNhoAgARidXJuEhFAAG0ANGdJRDMCERJEMwISRDMCFDIJEkQ0PzMCEgk1PzRAMwISCTVAIio0QGYiNHE0P2YjQzMCFDMCBzMCECMSTTYcARJENDREIigzAhEWUEpiNDQJZiMxAClQMwIRFlBKYjQ0CUlBAANmI0NIaCNDMgciJwhiCUk1+kEARiInCWIiJwpiNPodTEAANx4hBSMeHzX7SEhIIicLYiInDGI0+h1MQAAdHiEFIx4fNfxISEgiJwk0+2YiJws0/GYiJwgyB2YzAxIzAwgINTU2HAExABNENGdBACIiNGdwAEQ1BiIcNAYJND8INQQ2GgAnBhJAASA0ZzMEERJENhoAJwcSQABVNhwBMwQAEkQzBBI0Rx00BCMdH0hITEhJNRA0NAk1yTMEEjRIHTQEIx0fSEhMSEk1ETQ1CTXKNBA0ERBENEc0EAk1UTRINBEJNVI0BDMEEgk1U0ICCjYcATMCABJENEc0NAg1UTRINDUINVI0BCISQAAuNDQ0BB00RyMdH0hITEg0NTQEHTRIIx0fSEhMSEoNTUk0BAg1UzMEEgk1y0IBvyInBTMEEUk1Z2YoNGcWUDVxIjRncABERDRnNGUTRDRnNGYTRDMEEiQISR018DQ0NDUdNfFKDEAACBJENPA08Q5EMwQSJAgjCEkdNfA0NDQ1HTXxSg1AAAgSRDTwNPENRCQ1PzQEMwQSJAgINVNCAU82HAEzAgASRDMCETRlEjMDETRmEhBJNWRAABkzAhE0ZhIzAxE0ZRIQRDRINRI0RzUTQgAINEc1EjRINRM2GgGAAmZpEkAAWjYaAYACZm8SRDQ1JAs0Eh00EzQ1CSUdH0hITEgjCEk1FSINNDU0EwwQRDQ0NBUJNGRBABM1yTRHNBUINVE0SDQ1CTVSQgBnNco0SDQVCDVSNEc0NQk1UUIAVDQ0STUVJQs0Ex00EiQLNDQlCx4fSEhMSEk1FCINNBQ0EwwQRDQUNDUJNGRBABM1yjRHNDQINVE0SDQUCTVSQgATNck0RzQUCTVRNEg0NAg1UkIAADQVIQQLNAQdgaCcATQSHR9ISExISTUqNAQINVNCADsiKzYaARdJNWVmIicENhoCF0k1ZmY0ZXEDRIABLVCABEFMR080ZkEABkg0ZnEDRFAzAiZJFYEPTFISQyIqNEA0KghmIjRxND80Kgg0ywhmIjRvND00yQhmIjRwND40yghmIoACczE0UWYigAJzMjRSZiInCjRSIQYdNFEjHR9ISExIZiInDDRRIQYdNFIjHR9ISExIZiKAA2lsdDRTZjTLQQAJIzR7SmI0ywhmNMlBAAkjNHlKYjTJCGY0ykEACSM0ekpiNMoIZiNDI0MiQw==',
      );
    cy.get('@appTxInfoTableRows').eq(8).children().eq(0).should('have.text', 'Clear State Program');
    cy.get('@appTxInfoTableRows').eq(8).children().eq(1).as('clearTab');
    cy.get('@clearTab').find('.TabUnstyled-root').eq(0).should('have.text', 'TEAL');
    cy.get('@clearTab').find('.TabUnstyled-root').eq(1).should('have.text', 'Base64');
    cy.get('@clearTab').find('.TabUnstyled-root').eq(1).click();
    cy.get('@clearTab').find('.TabPanelUnstyled-root').eq(1).should('have.text', 'BIEB');
  });

  /* App Call Tx with Inner Txs */
  it('displays App Call Tx with Inner Txs info correctly', () => {
    cy.intercept(
      {
        method: 'GET',
        url: `${backend_url}/v1/transactions/*`,
      },
      {
        fixture: txInnerTxsFixture,
      },
    ).as('getInnersTx');
    cy.visit('/tx/Y5W6UWSSYEEOXJI2RHID66HYWIBQ4EVCCCZY5Q4LHK6XSC74BFNA');
    cy.wait('@getInnersTx');

    cy.get('[class*="Block_block-table"]').eq(0).find('tbody tr').as('appCallMainTable');
    cy.get('@appCallMainTable').eq(0).children().eq(0).should('have.text', 'ID');
    cy.get('@appCallMainTable').eq(0).children().eq(1).should('have.text', 'Y5W6UWSSYEEOXJI2RHID66HYWIBQ4EVCCCZY5Q4LHK6XSC74BFNA');
    cy.get('@appCallMainTable').eq(1).children().eq(0).should('have.text', 'Block');
    cy.get('@appCallMainTable').eq(1).children().eq(1).should('have.text', '13,348,578');
    cy.get('@appCallMainTable').eq(2).children().eq(0).should('have.text', 'Type');
    cy.get('@appCallMainTable').eq(2).children().eq(1).should('have.text', 'App Call');
    cy.get('@appCallMainTable').eq(3).children().eq(0).should('have.text', 'Sender');
    cy.get('@appCallMainTable').eq(3).children().eq(1).should('have.text', '4WMWVTICJG2XWSZBXSRALIULEUWKKERMT2NSY67JGOFRKVEW7FURVYC5OM');
    cy.get('@appCallMainTable').eq(4).children().eq(0).should('have.text', 'Fee');
    cy.get('@appCallMainTable').eq(4).children().eq(1).should('contain', '0.001');

    /* Inner Txs Info */
    cy.get('[class*="Block_block-table"]').eq(1).children('table').children('tbody').children('tr').as('innersTableRows');
    cy.get('@innersTableRows').eq(0).children().eq(0).should('contain', 'ASA Transfer');
    cy.get('@innersTableRows').eq(0).children().eq(1).should('contain', 'BHBJZQ...XWYV4Q');
    cy.get('@innersTableRows').eq(0).children().eq(2).should('contain', 'AAAAAA...Y5HFKQ');
    cy.get('@innersTableRows').eq(0).children().eq(3).should('contain', '0 ARCC');
    cy.get('@innersTableRows').eq(0).children().eq(4).should('contain', 'BQLHUS...TTNIW4');
    cy.get('@innersTableRows').eq(0).children().eq(5).should('contain', '0.0002 ARCC');
    cy.get('@innersTableRows').eq(0).children().eq(6).should('contain', '0.001');
    cy.get('@innersTableRows').eq(1).children().eq(0).should('contain', 'Payment');
    cy.get('@innersTableRows').eq(1).children().eq(1).should('contain', 'BHBJZQ...XWYV4Q');
    cy.get('@innersTableRows').eq(1).children().eq(2).should('contain', 'AAAAAA...Y5HFKQ');
    cy.get('@innersTableRows').eq(1).children().eq(3).should('contain', '0');
    cy.get('@innersTableRows').eq(1).children().eq(4).should('contain', '4WMWVT...VYC5OM');
    cy.get('@innersTableRows').eq(1).children().eq(5).should('contain', '1.2');
    cy.get('@innersTableRows').eq(1).children().eq(6).should('contain', '0.001');

    /* App Call Tx Info */
    cy.get('[class*="Block_block-table"]').eq(2).children('table').children('tbody').children('tr').as('appTxInfoTableRows');

    cy.get('@appTxInfoTableRows').eq(0).children().eq(0).should('have.text', 'Application ID');
    cy.get('@appTxInfoTableRows').eq(0).children().eq(1).should('have.text', '400404272');
    cy.get('@appTxInfoTableRows').eq(1).children().eq(0).should('have.text', 'Accounts');
    cy.get('@appTxInfoTableRows').eq(1).children().eq(1).should('contain', '4WMWVTICJG2XWSZBXSRALIULEUWKKERMT2NSY67JGOFRKVEW7FURVYC5OM');
    cy.get('@appTxInfoTableRows').eq(1).children().eq(1).should('contain', 'BQLHUSSAXDPOAXLEYEHS332FIT2RKDQ33RAL45JVTXQYMKNZ3CB3TTNIW4');
    cy.get('@appTxInfoTableRows').eq(2).children().eq(0).should('have.text', 'Foreign Assets');
    cy.get('@appTxInfoTableRows').eq(2).children().eq(1).should('have.text', '27165954');
    cy.get('@appTxInfoTableRows').eq(3).children().eq(0).should('have.text', 'On Completion');
    cy.get('@appTxInfoTableRows').eq(3).children().eq(1).should('have.text', 'delete');
    cy.get('@appTxInfoTableRows').eq(4).children().eq(0).should('have.text', 'Global State Schema');
    cy.get('@appTxInfoTableRows').eq(4).children().eq(1).should('contain', 'Number of byte-slice: 0');
    cy.get('@appTxInfoTableRows').eq(4).children().eq(1).should('contain', 'Number of uint: 0');
    cy.get('@appTxInfoTableRows').eq(5).children().eq(0).should('have.text', 'Local State Schema');
    cy.get('@appTxInfoTableRows').eq(5).children().eq(1).should('contain', 'Number of byte-slice: 0');
    cy.get('@appTxInfoTableRows').eq(5).children().eq(1).should('contain', 'Number of uint: 0');
  });
  /* Payment Tx with LogicSig */
  /* Payment Tx with MultiSig */
});
