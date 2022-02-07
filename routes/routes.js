const { Router } = require('express')
const router = Router()
const Device = require('../models/Device')
const { check, validationResult } = require('express-validator')

// /api/register
router.post('/register',
    [
        check('about', 'Минимальная длина текста 6 символов').isLength({ min: 6 }),
        check('name', 'Минимальная длина текста 1 символ').isLength({ min: 1 }),
        check('id', 'Минимальная длина текста 1 символ').isLength({ min: 1 }),
        check('specifications1', 'Минимальная длина текста 1 символ').isLength({ min: 1 }),
        check('specifications2', 'Минимальная длина текста 1 символ').isLength({ min: 1 }),
        check('specifications3', 'Минимальная длина текста 1 символ').isLength({ min: 1 }),
        check('specifications4', 'Минимальная длина текста 1 символ').isLength({ min: 1 }),
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