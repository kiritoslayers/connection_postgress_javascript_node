const express = require('express');
const bycript = require('bcrypt')

const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
})

const userRoutes = express.Router();

userRoutes.get('/api/v1/users', async (request, response) => {

    const { rows } = await pool.query('SELECT UserName, UserMail, UserStatus, UserStatus, CreatedAt FROM safee.madarah.users')
    return response.status(200).send(rows)
})

userRoutes.post('/api/v1/users', async (request, response) => {

    const { user, email, password } = request.body
    const passwordHash = await bycript.hash(password, 10)

    // existe uma forma melhor de fazer isso aqui....
    const query = `insert into safee.madarah.users (UserName, UserMail, HashPassword, UserStatus, CreatedAt) values ('${user}', '${email}', '${passwordHash}', true, NOW())`
    const users = await pool.query(query)

    return response.status(201).send(user)
})

userRoutes.put('/api/v1/users/:id', async (request, response) => {
    try {

        const { id } = request.params
        const { name, email, password } = request.body

        const id_int = parseInt(id)
        const password_hash = await bycript.hash(password, 10)

        const query = 'select * from safee.madarah.users where id =' + id
        const queryDb = await pool.query(query)

        if (queryDb.rows == 0) {
            return response.status(400).send("{Error: User is not found}")
        }

        const queryUpdate = `update safee.madarah.users set UserName = '${name}', UserMail = '${email}', HashPassword = '${password_hash}' where Id = ${id}`
        const { updateUsers } = await pool.query(queryUpdate)

        return response.status(204).send(updateUsers)

    } catch (error) {
        return response.status(400).send("{Error: invalid request}")
    }

})

userRoutes.patch('/api/v1/users/:id', async (request, response) => {

    try {
        const { id } = request.params
        const idInt = parseInt(id)

        const query = 'select * from safee.madarah.users where id =' + id
        const queryDb = await pool.query(query)

        if (queryDb.rows == 0) {
            return response.status(400).send("{Error: User is not found}")
        }

        const softDelete = "update safee.madarah.users set userstatus = false where id = " + idInt
        const deleteDb = await pool.query(softDelete)

        return response.status(200).send("{Message: User has been deleted!}")

    } catch (error) {
        response.status(400).send("{Error: Invalid request }")
    }
})


module.exports = userRoutes;