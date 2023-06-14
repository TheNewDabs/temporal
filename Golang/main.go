package main

import (
	"fmt"
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/shirou/gopsutil/v3/process"
)

func main() {
	app := fiber.New()

	go getProcesses()

	err := app.Listen(":8000")
	if err != nil {
		log.Fatalln("Error ", err)
	}

	time.Sleep(time.Second * 500)
}

func getProcesses() {
	for range time.Tick(time.Second) {
		processes, err := process.Processes()
		if err != nil {
			log.Fatal(err)
		}
		for _, proc := range processes {
			pid := proc.Pid

			name, err := proc.Name()
			if err != nil {
				log.Println(err)
			}

			username, err := proc.Username()
			if err != nil {
				log.Println(err)
			}

			status, err := proc.Status()
			if err != nil {
				log.Println(err)
			}

			cpu_percent, err := proc.CPUPercent()
			if err != nil {
				log.Println(err)
			}

			fmt.Println(pid, name, username, status, cpu_percent)
		}
	}
}
