
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/prisma/client'
import { hashPassword } from '@/libs/providers/password'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {

    if(req.method === "POST"){
        const isExistUser = await prisma.user.count({
            where: {username: req.body.username}
        })

        if(isExistUser === 0){
            let payload = {}
            if(req.body.password === ''){
                payload = {
                    username: req.body.username,
                    role: req.body.role,
                    avatar: req.body.avatar
                }
            }
            else{
                payload = {
                    username: req.body.username,
                    role: req.body.role,
                    avatar: req.body.avatar,
                    password: hashPassword(req.body.password)
                }
            }

            const result = await prisma.user.create({
                data: payload
            })

            res.status(200).json({ 
                success: true,
                message:`Successful Created a ${req.body.role} Account`,
                result: result
            })
        }
        else{
            res.status(200).json({ 
                success: false,
                message:"Account Already Exist"
            })
        }
    }   
}
  