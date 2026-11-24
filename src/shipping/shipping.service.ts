import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class ShippingService {
  private readonly zoneFees: Record<string, number> = {
    bangkok: 0,
    north: 10,
    south: 25,
  };

  calculateShipping(weightInput: string, zoneInput: string) {
    const weight = Number(weightInput);
    const zone = (zoneInput ?? '').toLowerCase();

    if (!Number.isFinite(weight) || weight <= 0) {
      throw new BadRequestException('weight ต้องเป็นจำนวนจริงที่มากกว่า 0');
    }

    if (!(zone in this.zoneFees)) {
      throw new BadRequestException('zone ต้องเป็น bangkok, north หรือ south');
    }

    const extraKg = weight > 1 ? Math.ceil(weight - 1) : 0;
    const baseFee = 50 + extraKg * 18;
    const zoneFee = this.zoneFees[zone];
    const total = baseFee + zoneFee;

    return {
      weight,
      zone,
      baseFee,
      zoneFee,
      total,
    };
  }
}