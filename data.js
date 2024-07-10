import bcrypt from 'bcryptjs'

const data = {
    users:[
        {
            name:'admin',
            password: bcrypt.hashSync('12345678', 8)
        },
        {
            name:'jay',
            password: bcrypt.hashSync('jay18998324497', 8)
        }
    ]
}

export default data;