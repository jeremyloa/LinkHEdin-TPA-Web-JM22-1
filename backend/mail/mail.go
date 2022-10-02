package mail

import (
	"fmt"
	gomail "gopkg.in/gomail.v2"
)

fromMail := mail@gmail.com
secretCode := xxx

func SendVer(toMail string, code string){
	msg := gomail.NewMessage()
    msg.SetHeader("From", fromMail)
    msg.SetHeader("To", toMail)
    msg.SetHeader("Subject", "LinkHEdIn Account Verification")
    msg.SetBody("text/html", 
	"Press this link to activate to your account: <a href= 'http://127.0.0.1:5173/activate/" + code + "'>" + code + "</a>")

    n := gomail.NewDialer("smtp.gmail.com", 587, fromMail, secretCode)

    // Send the email
    if err := n.DialAndSend(msg); err != nil {
		fmt.Println(err)
        panic(err)
    }
}

func SendResetPass(toMail string, code string){
	msg := gomail.NewMessage()
    msg.SetHeader("From", fromMail)
    msg.SetHeader("To", toMail)
    msg.SetHeader("Subject", "LinkHEdIn Account Password Reset")
    msg.SetBody("text/html", 
	"Press this link to activate to your account: <a href= 'http://127.0.0.1:5173/reset/" + code + "'>" + code + "</a>")

    n := gomail.NewDialer("smtp.gmail.com", 587, fromMail, secretCode)

    // Send the email
    if err := n.DialAndSend(msg); err != nil {
		fmt.Println(err)
        panic(err)
    }
}