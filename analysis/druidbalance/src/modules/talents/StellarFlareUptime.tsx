import { t } from '@lingui/macro';
import { formatPercentage } from 'common/format';
import SPELLS from 'common/SPELLS';
import { SpellLink } from 'interface';
import UptimeIcon from 'interface/icons/Uptime';
import Analyzer, { Options } from 'parser/core/Analyzer';
import { ThresholdStyle, When } from 'parser/core/ParseResults';
import Enemies from 'parser/shared/modules/Enemies';
import BoringSpellValueText from 'parser/ui/BoringSpellValueText';
import Statistic from 'parser/ui/Statistic';
import STATISTIC_ORDER from 'parser/ui/STATISTIC_ORDER';

class StellarFlareUptime extends Analyzer {
  get suggestionThresholds() {
    const stellarFlareUptime =
      this.enemies.getBuffUptime(SPELLS.STELLAR_FLARE_TALENT.id) / this.owner.fightDuration;
    return {
      actual: stellarFlareUptime,
      isLessThan: {
        minor: 0.95,
        average: 0.9,
        major: 0.8,
      },
      style: ThresholdStyle.PERCENTAGE,
    };
  }

  static dependencies = {
    enemies: Enemies,
  };
  protected enemies!: Enemies;

  constructor(options: Options) {
    super(options);
    this.active = this.selectedCombatant.hasTalent(SPELLS.STELLAR_FLARE_TALENT.id);
  }

  suggestions(when: When) {
    when(this.suggestionThresholds).addSuggestion((suggest, actual, recommended) =>
      suggest(
        <>
          Your <SpellLink id={SPELLS.STELLAR_FLARE_TALENT.id} /> uptime can be improved. Try to pay
          more attention to your Stellar Flare on the boss.
        </>,
      )
        .icon(SPELLS.STELLAR_FLARE_TALENT.icon)
        .actual(
          t({
            id: 'druid.balance.suggestions.stellarFlare.uptime',
            message: `${formatPercentage(actual)}% Stellar Flare uptime`,
          }),
        )
        .recommended(`>${formatPercentage(recommended)}% is recommended`),
    );
  }

  statistic() {
    const stellarFlareUptime =
      this.enemies.getBuffUptime(SPELLS.STELLAR_FLARE_TALENT.id) / this.owner.fightDuration;
    return (
      <Statistic position={STATISTIC_ORDER.CORE(7)} size="flexible">
        <BoringSpellValueText spellId={SPELLS.STELLAR_FLARE_TALENT.id}>
          <>
            <UptimeIcon /> {formatPercentage(stellarFlareUptime)} % <small>uptime</small>
          </>
        </BoringSpellValueText>
      </Statistic>
    );
  }
}

export default StellarFlareUptime;
