import { VoucherCreateData } from "../../src/services/voucherService.js";
import { faker } from '@faker-js/faker';
import prisma from "../../src/config/database.js";

function createVoucherData(): VoucherCreateData {
    return {
        code: faker.random.alpha(10),
        discount: 10,
        used: false
    }
}

async function createVoucher(voucherData: VoucherCreateData | null = null) {
    const data = voucherData ? voucherData : {
        code: faker.random.alpha(10),
        discount: 10,
        used: false
    }
    await prisma.voucher.create({data})
}

const voucherFactory = {
    createVoucherData,
    createVoucher
}

export default voucherFactory;