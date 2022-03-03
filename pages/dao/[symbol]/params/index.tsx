import PreviousRouteBtn from '@components/PreviousRouteBtn'
import useRealm from '@hooks/useRealm'
import { fmtMintAmount } from '@tools/sdk/units'
import { capitalize } from '@utils/helpers'
import { getTreasuryAccountItemInfoV2 } from '@utils/treasuryTools'
import useGovernanceAssetsStore, {
  AccountType,
} from 'stores/useGovernanceAssetsStore'
import {
  getFormattedStringFromDays,
  SECS_PER_DAY,
} from 'VoteStakeRegistry/tools/dateTools'

const Params = () => {
  const { realm, mint, councilMint } = useRealm()
  const governedAccounts = useGovernanceAssetsStore((s) => s.governedAccounts)
  const realmAccount = realm?.account
  const communityMint = realmAccount?.communityMint.toBase58()
  const councilMintPk = realmAccount?.config.councilMint?.toBase58()
  const communityMintMaxVoteWeightSource =
    realmAccount?.config.communityMintMaxVoteWeightSource
  const realmConfig = realmAccount?.config
  const getYesNoString = (val) => {
    return val ? ' Yes' : ' No'
  }
  return (
    <div className="grid grid-cols-12">
      <div className="bg-bkg-2 rounded-lg p-4 md:p-6 col-span-12 space-y-3">
        <div className="flex flex-row items-center">
          <PreviousRouteBtn />
          <h1 className="ml-3">Parameters</h1>
        </div>
        <div>
          <h2>Realm</h2>
          <DisplayField
            padding
            label="name"
            val={realmAccount?.name}
          ></DisplayField>
          <DisplayField
            padding
            label="pubkey"
            val={realm?.pubkey.toBase58()}
          ></DisplayField>
          <DisplayField
            padding
            label="authority"
            val={realmAccount?.authority?.toBase58()}
          ></DisplayField>
          <DisplayField
            padding
            label="owner"
            val={realm?.owner.toBase58()}
          ></DisplayField>
          <DisplayField
            padding
            label="voting proposals count"
            val={realmAccount?.votingProposalCount}
          ></DisplayField>
          {communityMint && (
            <DisplayField
              padding
              label="Community mint"
              val={communityMint}
            ></DisplayField>
          )}
          {councilMintPk && (
            <DisplayField
              padding
              label="Council mint"
              val={councilMintPk}
            ></DisplayField>
          )}
          <div className="py-5">
            <h3>Config</h3>
            {communityMintMaxVoteWeightSource && (
              <DisplayField
                padding
                label="Community mint max vote weight source"
                val={`${communityMintMaxVoteWeightSource.fmtSupplyFractionPercentage()}
              %`}
              ></DisplayField>
            )}
            <DisplayField
              padding
              label="Min community tokens to create governance"
              val={
                realmConfig &&
                fmtMintAmount(
                  mint,
                  realmConfig!.minCommunityTokensToCreateGovernance
                )
              }
            ></DisplayField>
            <DisplayField
              padding
              label="Use community voter weight addin"
              val={getYesNoString(realmConfig?.useCommunityVoterWeightAddin)}
            ></DisplayField>
            <DisplayField
              padding
              label="Use max community voter weight addin"
              val={getYesNoString(realmConfig?.useMaxCommunityVoterWeightAddin)}
            ></DisplayField>
          </div>
        </div>
        <div className="pb-5 pl-10 pr-5 ">
          <h2>Governances</h2>
          <div className="grid grid-cols-12 gap-x-6">
            {governedAccounts.map((x) => {
              const pubKey = x.pubkey
              const governanceAccount = x.account
              const governanceConfig = x.account.config
              const accounts = x.accounts
              return (
                <div
                  className="border border-fgd-4 default-transition rounded-lg css-1tv4gvt-StyledCardWrapper elzt7lo0 col-span-6 mb-6  bg-bkg-1"
                  key={pubKey.toBase58()}
                >
                  <h3 className="bg-bkg-4 px-4 py-4 pr-16 rounded-md flex flex-col break-all">
                    {pubKey.toBase58()}
                  </h3>
                  <div className="p-5">
                    <DisplayField
                      label="owner"
                      val={x.owner.toBase58()}
                    ></DisplayField>
                    {realmAccount?.authority?.toBase58() ===
                      pubKey.toBase58() && (
                      <DisplayField
                        label="realm authority"
                        val={'Yes'}
                      ></DisplayField>
                    )}
                    <DisplayField
                      label="proposals count"
                      val={governanceAccount.proposalCount}
                    ></DisplayField>
                    <DisplayField
                      label=" voting proposals count"
                      val={governanceAccount.votingProposalCount}
                    ></DisplayField>
                    <div>
                      <h3 className="mb-5">Config</h3>
                      <DisplayField
                        label=" Max voting time"
                        val={getFormattedStringFromDays(
                          governanceConfig.maxVotingTime / SECS_PER_DAY
                        )}
                      ></DisplayField>
                      {communityMint && (
                        <DisplayField
                          label="Min community tokens to create proposal"
                          val={fmtMintAmount(
                            mint,
                            governanceConfig.minCommunityTokensToCreateProposal
                          )}
                        ></DisplayField>
                      )}
                      {councilMint && (
                        <DisplayField
                          label="Min council tokens to create proposal"
                          val={fmtMintAmount(
                            councilMint,
                            governanceConfig.minCouncilTokensToCreateProposal
                          )}
                        ></DisplayField>
                      )}
                      <DisplayField
                        label="Min instruction holdup time"
                        val={governanceConfig.minInstructionHoldUpTime}
                      ></DisplayField>
                      <DisplayField
                        label="Proposal cool off time"
                        val={governanceConfig.proposalCoolOffTime}
                      ></DisplayField>
                      <DisplayField
                        label="Vote threshold percentage"
                        val={governanceConfig.voteThresholdPercentage.value}
                      ></DisplayField>
                      <DisplayField
                        label="Vote tipping"
                        val={governanceConfig.voteTipping}
                      ></DisplayField>
                    </div>
                    {accounts.length !== 0 && (
                      <div className="p-3">
                        <h3 className="mb-5">Accounts ({accounts.length})</h3>
                        <div
                          className="overflow-y-auto overflow-x-hidden rounded-lg"
                          style={{ maxHeight: 500 }}
                        >
                          {accounts.map((x) => {
                            const info = getTreasuryAccountItemInfoV2(x)
                            if (
                              x.type === AccountType.TOKEN ||
                              x.type === AccountType.SOL
                            ) {
                              return (
                                <div
                                  className="mb-3 border border-fgd-4 p-3 bg-bkg-2"
                                  key={x.pubkey.toBase58()}
                                >
                                  <DisplayField
                                    bg={false}
                                    label="Address"
                                    val={x.extensions?.transferAddress?.toBase58()}
                                  ></DisplayField>

                                  <DisplayField
                                    bg={false}
                                    label="Amount"
                                    val={info.amountFormatted}
                                  ></DisplayField>
                                  <DisplayField
                                    bg={false}
                                    label="Type"
                                    val={AccountType[x.type]}
                                  ></DisplayField>
                                  <DisplayField
                                    bg={false}
                                    label="Name"
                                    val={info.name}
                                  ></DisplayField>

                                  {info.info?.symbol && (
                                    <DisplayField
                                      bg={false}
                                      label="Symbol"
                                      val={info.info?.symbol}
                                    ></DisplayField>
                                  )}
                                  <DisplayField
                                    label="Mint"
                                    bg={false}
                                    val={x.extensions.mint?.publicKey.toBase58()}
                                  ></DisplayField>
                                  {info.logo && (
                                    <DisplayField
                                      bg={false}
                                      label="Token img"
                                      val={
                                        <img
                                          className="w-6"
                                          src={info.logo}
                                        ></img>
                                      }
                                    ></DisplayField>
                                  )}
                                </div>
                              )
                            }
                            if (x.type === AccountType.MINT) {
                              return (
                                <div
                                  className="mb-3 border border-fgd-4 p-3 bg-bkg-2"
                                  key={x.pubkey.toBase58()}
                                >
                                  <DisplayField
                                    bg={false}
                                    label="Type"
                                    val={AccountType[x.type]}
                                  ></DisplayField>
                                  <DisplayField
                                    bg={false}
                                    label="Pubkey"
                                    val={x.extensions.mint?.publicKey.toBase58()}
                                  ></DisplayField>
                                  <DisplayField
                                    bg={false}
                                    label="Decimals"
                                    val={x.extensions.mint?.account.decimals}
                                  ></DisplayField>
                                  <DisplayField
                                    bg={false}
                                    label="Mint authority"
                                    val={x.extensions.mint?.account.mintAuthority?.toBase58()}
                                  ></DisplayField>
                                  <DisplayField
                                    bg={false}
                                    label="Supply"
                                    val={x.extensions.mint?.account.supply.toNumber()}
                                  ></DisplayField>
                                  <DisplayField
                                    bg={false}
                                    label="Is initialized"
                                    val={getYesNoString(
                                      x.extensions.mint?.account.isInitialized
                                    )}
                                  ></DisplayField>
                                  <DisplayField
                                    bg={false}
                                    label="Freeze authority"
                                    val={x.extensions.mint?.account.freezeAuthority?.toBase58()}
                                  ></DisplayField>
                                </div>
                              )
                            }
                            if (x.type === AccountType.PROGRAM) {
                              return (
                                <div
                                  className="mb-3 border border-fgd-4 p-3 bg-bkg-2"
                                  key={x.pubkey.toBase58()}
                                >
                                  <DisplayField
                                    bg={false}
                                    label="Type"
                                    val={AccountType[x.type]}
                                  ></DisplayField>
                                  <DisplayField
                                    bg={false}
                                    label="Pubkey"
                                    val={x.pubkey.toBase58()}
                                  ></DisplayField>
                                </div>
                              )
                            }
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

const DisplayField = ({ label, val, padding = false, bg = true }) => {
  return (
    <div
      className={`flex flex-col mb-2 ${bg ? 'bg-bkg-1' : ''} ${
        padding ? 'p-3' : ''
      }`}
    >
      <div className="text-xs text-fgd-3">{capitalize(label)}</div>
      <div className="text-sm break-all">{val}</div>
    </div>
  )
}

export default Params