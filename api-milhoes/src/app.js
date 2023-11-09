import express from 'express';
import cors from 'cors';
import dotEnv from 'dotenv'

import { Parceiro } from './repositorio/parceiro.js';
import { NodemailerEmail } from './node-mailer/node-mailer-email.js'

dotEnv.config()

const app = express()

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 
}

app.use(cors(corsOptions))
app.use(express.json())

const parceiro = new Parceiro();
const nodeMailer = new NodemailerEmail();

app.get('/parceiros', async (req, res) => {
   try {
    const parceiros = await parceiro.findAll()
    res.status(200).json(parceiros)      
   } catch(e) {
     console.error(e.message)
   }
})

app.post('/parceiros', async (req, res) => {
   const data = req.body;

   try {
      await parceiro.create(data);

      await nodeMailer.sendMail({
        subject: 'Cadastro Mais Valor',
        corpo: [
          `<div style="font-family sans-serif. font-size:16px; color: #222;">
            Seja bem vindo ao Grupo Mais Valor <br/><br/>

            Já temos seus dados básicos e agora precisamos que você complemente seu cadastro no link abaixo, assim temos como direcioná-lo para nosso Time Comercial.<br/> <br/>
            <a href="https://www.portalmaisvalor.com/paginas/cadastro/fichas/parceiro.html">Formulario Parceiro</a>`,
         
          `</div>`
        ].join('\n'),
  
        destinatario: data.email
      })

      const { razaoSocial, email, cnpj, telefone, cpfSocio } = data

      await nodeMailer.sendMail({
        subject: 'Cadastro Mais Valor',
        corpo: [
            `<div style="font-family: sans-serif; font-size: 16px; color: #222; background-color: #f5f5f5; padding: 20px;">`,
            `<div style="background-color: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">`,
                
                `<p><b>Razão social:</b> ${razaoSocial}</p>`,
                `<p><b>Cnpj:</b> ${cnpj}</p>`,
                `<p><b>Telefone:</b> ${telefone}</p>`,
                `<p><b>Cpf:</b> ${cpfSocio} </p>`,
                `<p><b>E-mail:</b> ${email}</p>`,
            `</div>`,
        `</div>`
       
        ].join('\n'),
  
        destinatario: 'cadastro_parceiro@grupomaisvalor.com.br'
      })

      res.status(201).json({ message: "Dados salvos com sucesso." })  
   } catch(e) {
     console.error(e.message);

     return res.status(400).json({
        message: 'Erro salvar os dados'
     })
   }
})

app.listen(process.env.PORT, (req, res) => {
    console.log("aplicação rodando na porta 9000")
})


