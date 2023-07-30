import { ResponseDto } from '../../dto';

export class OtherUtils {
  static responseDto = new ResponseDto();

  static randomDigits(length = 6): string {
    let min = '1';
    let max = '9';

    while (length - 1) {
      min += '0';
      max += '9';
      length--;
    }

    return (
      Math.floor(Math.random() * (parseInt(max) - parseInt(min) + 1)) +
      parseInt(min)
    ).toString();
  }

  static generateSlug(str: string): string {
    if (!str) {
      return '';
    }
    str = str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\u0111/g, 'd')
      .replace(/[^\w\s]/gi, '')
      .trim();
    return str.replace(/\s+/g, '-');
  }

  static regExpSearch(value: string): RegExp {
    return new RegExp(`${value}`, 'ig');
  }

  static loadError(message: string) {
    console.log(41, message);
    this.responseDto.withMessage(message);
  }
}
