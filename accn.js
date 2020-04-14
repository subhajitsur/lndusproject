const nodemailer =require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')
var otpGenerator = require('otp-generator')


function generateOtp(email){
const otp = otpGenerator.generate(5, { upperCase: false, specialChars: false,alphabets: false })
console.log(otp)
let transporter = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    auth:{
        user: "subhosur288@gmail.com",
        pass: "subhosur1234"
    }
}))

let mailoption = {
    from : "subhosur288@gmail.com",
    to :  "subhajitsur22@gmail.com",
    subject :'testing',
    text :otp
}
transporter.sendMail(mailoption,function(err,data)
{
    if(err)
    {
        console.log('error occure',err)
    }
    else{
        console.log('email sent')
    }
})
}

//generateOtp('sahaarpita505@gmail.com');
module.exports =generateOtp;