const { Router } = require('express')
const router = Router()
const Device = require('../models/Device')
const { check, validationResult } = require('express-validator')

// /api/register
router.post('/register',
    [
        check('about', 'Минимальная длина текста 6 символов').isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректные данные при создании'
                })
            }

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
            console.log(e)
            res.status(500).json({ message: 'Что-то пошло не так' })
        }
    })

router.get('/register', async (req, res) => { 
        try {
            const phones = await Device.find();
            res.json(phones)
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    });

module.exports = router