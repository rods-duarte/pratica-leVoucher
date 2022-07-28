import voucherFactory from '../factories/voucherFactory.js';
import voucherService from '../../src/services/voucherService.js';
import voucherRepository from '../../src/repositories/voucherRepository.js';
import { jest } from '@jest/globals';
import { conflictError } from '../../src/utils/errorUtils.js';

describe("create voucher test suite", () => {
  it("given a voucher should execute createVoucher func", async () => {
    const voucher = {id: 1, code: "123ADSA", discount: 10, used: false};
    jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(null);
    jest.spyOn(voucherRepository, "createVoucher").mockResolvedValueOnce(voucher);

    await voucherService.createVoucher(voucher.code, voucher.discount);
    expect(voucherRepository.createVoucher).toBeCalledTimes(1);
  })

  it("should fail when creating a voucher", async () => {
    const voucher = {id: 1, code: "123ADSA", discount: 10, used: false};
    jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(voucher);

    expect(voucherService.createVoucher(voucher.code, voucher.discount)).rejects.toEqual(conflictError("Voucher already exist."));
  })
})

describe("apply voucher test suit", () => {
  it("given a valid voucher and amount should apply discount", async () => {
    const voucher = {id: 1, code: "ABCDEFGHIJ", discount: 10, used: false};
    const amount = 500;

    jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(voucher);
    jest.spyOn(voucherRepository, "useVoucher").mockResolvedValueOnce(null);

    const data = await voucherService.applyVoucher(voucher.code, 500);
    expect(data.amount).toBe(amount);
    expect(data.discount).toBe(voucher.discount);
    expect(data.finalAmount).toBe(amount - (amount*voucher.discount/100));
    expect(data.applied).toBe(true);
  })

  it('given an used voucher should not apply discount', async () => {
    const voucher = {id: 1, code: "ABCDEFGHIJ", discount: 10, used: true};
    const amount = 500;

    jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(voucher);
    jest.spyOn(voucherRepository, "useVoucher").mockResolvedValueOnce(null);

    const data = await voucherService.applyVoucher(voucher.code, 500);
    expect(data.amount).toBe(amount);
    expect(data.discount).toBe(voucher.discount);
    expect(data.finalAmount).toBe(amount);
    expect(data.applied).toBe(false);
  })

  it('given a voucher that not exists should throw error', async () => {
    const voucher = {id: 1, code: "ABCDEFGHIJ", discount: 10, used: true};
    const amount = 500;

    jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(null);
    jest.spyOn(voucherRepository, "useVoucher").mockResolvedValueOnce(null);

    expect(voucherService.applyVoucher(voucher.code, voucher.discount)).rejects.toEqual(conflictError("Voucher does not exist."));
  })

  it('given a amount less than 100 should not apply discount', async () => {
    const voucher = {id: 1, code: "ABCDEFGHIJ", discount: 10, used: false};
    const amount = 50;

    jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(voucher);
    jest.spyOn(voucherRepository, "useVoucher").mockResolvedValueOnce(null);

    const data = await voucherService.applyVoucher(voucher.code, 50);
    expect(data.amount).toBe(amount);
    expect(data.discount).toBe(voucher.discount);
    expect(data.finalAmount).toBe(amount);
    expect(data.applied).toBe(false);
  })
})
