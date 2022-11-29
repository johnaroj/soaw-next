import { NEXT_JWT_SECRET } from '@/config/index';

import jwt from 'jsonwebtoken'

const generateToken = (id) => {
    return jwt.sign({ id }, NEXT_JWT_SECRET)
}

export default generateToken