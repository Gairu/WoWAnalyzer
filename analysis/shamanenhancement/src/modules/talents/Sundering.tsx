import SPELLS from 'common/SPELLS';
import Analyzer, { Options, SELECTED_PLAYER } from 'parser/core/Analyzer';
import Events, { CastEvent, DamageEvent } from 'parser/core/Events';
import AverageTargetsHit from 'parser/ui/AverageTargetsHit';
import BoringSpellValueText from 'parser/ui/BoringSpellValueText';
import ItemDamageDone from 'parser/ui/ItemDamageDone';
import Statistic from 'parser/ui/Statistic';
import STATISTIC_CATEGORY from 'parser/ui/STATISTIC_CATEGORY';
import STATISTIC_ORDER from 'parser/ui/STATISTIC_ORDER';

/**
 * Shatters a line of earth in front of you with your main hand weapon,
 * causing (187.2% of Attack power) Flamestrike damage
 * and Incapacitating any enemy hit for 2 sec.
 *
 * Example Log:
 */
class Sundering extends Analyzer {
  protected damageGained: number = 0;
  protected casts: number = 0;
  protected hits: number = 0;

  constructor(options: Options) {
    super(options);

    this.active = this.selectedCombatant.hasTalent(SPELLS.SUNDERING_TALENT.id);

    this.addEventListener(
      Events.cast.by(SELECTED_PLAYER).spell(SPELLS.SUNDERING_TALENT),
      this.onCast,
    );

    this.addEventListener(
      Events.damage.by(SELECTED_PLAYER).spell(SPELLS.SUNDERING_TALENT),
      this.onDamage,
    );
  }

  onDamage(event: DamageEvent) {
    this.hits += 1;
    this.damageGained += event.amount + (event.absorbed || 0);
  }

  onCast(event: CastEvent) {
    this.casts += 1;
  }

  statistic() {
    return (
      <Statistic
        position={STATISTIC_ORDER.OPTIONAL()}
        size="flexible"
        category={STATISTIC_CATEGORY.TALENTS}
      >
        <BoringSpellValueText spellId={SPELLS.SUNDERING_TALENT.id}>
          <>
            <ItemDamageDone amount={this.damageGained} />
            <br />
            <AverageTargetsHit casts={this.casts} hits={this.hits} />
          </>
        </BoringSpellValueText>
      </Statistic>
    );
  }
}

export default Sundering;
