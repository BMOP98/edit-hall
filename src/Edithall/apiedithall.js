const express = require('express');
const router = express.Router();
const connection = require('../../modules/dbconect');
const fs = require('fs');
const path = require('path');

// Ruta para obtener los datos del hall por id
router.get('/:idhall', (req, res) => {
    const { idhall } = req.params;
    var query = 'SELECT * FROM halls WHERE idhalls = ?';
    connection.query(query, [idhall], (err, results) => {
        if (err) {
            console.log("ERROR " + err.message);
            console.log("err: " + err.message);
            return res.status(500).json({ err: err.message });
        }
        if (results.length > 0) {
            res.status(200).json(results[0]);
        } else {
            res.status(404).json('Hall not found');
        }
    });
});

// Ruta para actualizar los datos del hall
router.post('/', async (req, res) => {
    const { idhalls, name, originalName, price, description, capacity, address } = req.body;
    var query = 'UPDATE halls SET name = ?, price = ?, description = ?, capacity = ?, address = ? WHERE idhalls = ?';
    connection.query(query, [name, price, description, capacity, address, idhalls], async (err, results) => {
        if (err) {
            console.log("ERROR " + err.message);
            return res.status(500).json({ err: err.message });
        }
        if (results.affectedRows > 0) {
            const resp = await fetch("http://localhost:4009/apieditimages", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, originalName })
            });
            if (resp.ok) {
                res.status(200).json("Hall updated successfully");
            }
        } else {
            res.status(404).json('Hall not found');
        }
    });
});

router.delete('/:idhall/:name', async (req, res) => {
    const { idhall, name } = req.params;
    var query = 'DELETE FROM halls WHERE idhalls = ?';
    connection.query(query, [idhall], async (err, results) => {
        if (err) {
            console.log("ERROR " + err.message);
            return res.status(500).json({ err: err.message });
        }
        if (results.affectedRows > 0) {
            const url = "http://localhost:4009/apieditimages/" + name;
            const response = await fetch(url, {
                method: 'DELETE'
            });
            if (!response.ok) {
                return res.status(500).json("Ocurrio un error");
            }else{
                res.status(200).json("Hall deleted successfully removed")
            }
        } else {
            res.status(404).json('Hall not found');
        }
    });
});

module.exports = router;
