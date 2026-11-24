import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class ElectricityService {
  private readonly serviceCharges: Record<string, number> = {
    residential: 40,
    business: 90,
  };

  private readonly tier1Limit = 150;
  private readonly tier1Rate = 3;
  private readonly tier2Rate = 4;

  calculateElectricity(unitsInput: string, typeInput: string) {
    const units = Number(unitsInput);
    const type = (typeInput ?? '').toLowerCase();

    if (
      unitsInput === undefined ||
      unitsInput.trim() === '' ||
      !Number.isInteger(units) ||
      units < 0
    ) {
      throw new BadRequestException('units ต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป');
    }

    if (!(type in this.serviceCharges)) {
      throw new BadRequestException('type ต้องเป็น residential หรือ business');
    }

    const tier1Units = Math.min(units, this.tier1Limit);
    const tier2Units = Math.max(0, units - this.tier1Limit);
    const energyCharge =
      tier1Units * this.tier1Rate + tier2Units * this.tier2Rate;
    const serviceCharge = this.serviceCharges[type];
    const total = energyCharge + serviceCharge;

    return {
      units,
      type,
      energyCharge,
      serviceCharge,
      total,
    };
  }
}