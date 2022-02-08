const { Router } = require('express')
const router = Router()
const Device = require('../models/Device')

// /api/register
router.post('/register',

    async (req, res) => {
        try {


            const { name, id } = req.body
            const namePhone = await Device.findOne({ name })
            const idPhone = await Device.findOne({ id })

            if (namePhone || idPhone) {
                return res.status(400).json({ message: 'Такая модель уже существует' })
            }
            const phone = new Device(req.body)

            await phone.save()

            res.status(201).json({ message: 'Телефон создан' })

        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так' })
        }
    })

router.get('/register', async (req, res) => {
    try { 
        const phones = await Device.find();
        res.json(phones)
    } catch (e) {
        res.status(500).json(e)
    }
});
router.delete('/delete', async (req, res) => {
    try {
        const { id } = req.body
        await Device.deleteOne({ id });
        res.json({ message: 'телефон удален'})
    } catch (e) {
        res.status(500).json(e)
    }
});

module.exports = router