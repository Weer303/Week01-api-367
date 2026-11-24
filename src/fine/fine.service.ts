import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FineService {
  private readonly rates: Record<string, number> = {
    general: 5,
    reserve: 20,
    reference: 50,
  };

  private readonly maxFine = 500;
  private readonly graceDays = 3;

  calculateFine(daysInput: string, typeInput: string) {
    const days = Number(daysInput);
    const type = (typeInput ?? '').toLowerCase();

    if (!Number.isInteger(days) || days < 0) {
      throw new BadRequestException('days ต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป');
    }

    if (!(type in this.rates)) {
      throw new BadRequestException(
        'type ต้องเป็น general, reserve หรือ reference',
      );
    }

    const chargeableDays = Math.max(0, days - this.graceDays);
    const rate = this.rates[type];
    const rawTotal = chargeableDays * rate;
    const total = Math.min(rawTotal, this.maxFine);

    return {
      days,
      type,
      chargeableDays,
      rate,
      total,
    };
  }
}