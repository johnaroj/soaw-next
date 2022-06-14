
import prisma from '@/config/db'

const monthName = {
    1: "Jan",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "May",
    6: "Jun",
    7: "Jul",
    8: "Aug",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec"
};
const handler = async (req, res) => {
    if (req.method === 'GET') {
        try {
            const result = await prisma.$queryRaw`
            SELECT DATEPART(month, r.Updated) month,r.Type as [type], Count(*) as total FROM [SOAW].dbo.Requests r
            WHERE DATEPART(year, [r].[Updated]) = ${req.query.year} 
            GROUP BY DATEPART(Month,  r.Updated),[type]
            ORDER BY month
            `
            const request = result.map(r => ({ ...r, monthName: monthName[r.month] }))
            res.status(200).json(request)
        } catch (error) {
            res.status(500).json({ success: false, message: error.message })
        } finally {
            await prisma.$disconnect()
        }
    }
    else {
        res.setHeader('Allow', ['GET'])
        res.status(405).json({ success: false, message: `Method ${req.method} is not allowed` })
    }

}

export default handler