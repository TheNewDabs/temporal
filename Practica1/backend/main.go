package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
)

type Operation struct {
	Num1      float32   `json:"Num1"`
	Num2      float32   `json:"Num2"`
	Operacion string    `json:"Operacion"`
	Resultado float32   `json:"Resultado"`
	Fecha     time.Time `json:"Fecha"`
}

type Script struct {
	Resultado float32 `json:"Resultado"`
	Error     string  `json:"Error"`
}

func main() {
	router := mux.NewRouter()
	router.HandleFunc("/", getOperations).Methods("GET")
	router.HandleFunc("/", DoOperacion).Methods("POST")
	fmt.Print("Server run on: localhost:4000")
	log.Fatal(http.ListenAndServe(":4000", router))
}

func DoOperacion(w http.ResponseWriter, req *http.Request) {
	db, err := createConection()
	if err != nil {
		panic(err)
	}
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	var Operacion Operation
	var ScriptResult Script
	_ = json.NewDecoder(req.Body).Decode(&Operacion)
	ScriptResult.Error = ""
	if Operacion.Operacion == "+" {
		ScriptResult.Resultado = Operacion.Num1 + Operacion.Num2
	} else if Operacion.Operacion == "-" {
		ScriptResult.Resultado = Operacion.Num1 - Operacion.Num2
	} else if Operacion.Operacion == "*" {
		ScriptResult.Resultado = Operacion.Num1 * Operacion.Num2
	} else if Operacion.Operacion == "/" {
		if Operacion.Num2 != 0 {
			ScriptResult.Resultado = Operacion.Num1 / Operacion.Num2
		} else {
			ScriptResult.Resultado = 0
			ScriptResult.Error = "Error, Division entre 0"
		}
	} else {
		ScriptResult.Resultado = Operacion.Num1
	}
	b := []byte("")
	dt := time.Now()
	if ScriptResult.Error == "" {
		b = []byte(fmt.Sprintf("%v", Operacion.Num1) + "," + fmt.Sprintf("%v", Operacion.Num2) + "," + fmt.Sprintf("%v", Operacion.Operacion) + "," + fmt.Sprintf("%v", ScriptResult.Resultado) + "," + dt.String())
	} else {
		b = []byte(ScriptResult.Error)
	}
	ioutil.WriteFile("logs/logs.txt", b, 0644)
	ctx := context.Background()
	err = queryAddOperation(ctx, db, Operacion, ScriptResult.Resultado)
	if err != nil {
		panic(err)
	}
	db.Close()
	json.NewEncoder(w).Encode(ScriptResult)
}

func getOperations(w http.ResponseWriter, req *http.Request) {
	db, err := createConection()
	if err != nil {
		panic(err)
	}
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	ctx := context.Background()

	Operaciones := []Operation{}
	Operaciones, err = queryGetOperation(ctx, db)
	if err != nil {
		panic(err)
	}
	db.Close()
	json.NewEncoder(w).Encode(Operaciones)
}

func queryGetOperation(ctx context.Context, db *sql.DB) ([]Operation, error) {
	qry := "SELECT * FROM Operaciones;"

	rows, err := db.QueryContext(ctx, qry)
	if err != nil {
		return nil, err
	}

	Operaciones := []Operation{}

	for rows.Next() {
		b := Operation{}
		err = rows.Scan(&b.Num1, &b.Num2, &b.Operacion, &b.Resultado, &b.Fecha)
		if err != nil {
			return nil, err
		}
		Operaciones = append(Operaciones, b)
	}
	return Operaciones, nil
}

func queryAddOperation(ctx context.Context, db *sql.DB, Nueva Operation, Resultado float32) error {
	qry := " Insert Into Operaciones (Numero1, Numero2, Operacion, Resultado) VALUES (?,?,?,?);"
	result, err := db.ExecContext(ctx, qry, Nueva.Num1, Nueva.Num2, Nueva.Operacion, Resultado)
	if err != nil {
		return err
	}

	id, err := result.LastInsertId()

	if err != nil {
		return err
	}
	fmt.Println("INSERT ID:", id)
	return nil
}

func createConection() (*sql.DB, error) {
	connectionString := "root:123@tcp(DBmysql:3306)/db_calculadora?parseTime=True"
	db, err := sql.Open("mysql", connectionString)
	if err != nil {
		panic(err)
	}
	db.SetMaxOpenConns(500)
	err = db.Ping()
	if err != nil {
		return nil, err
	}
	return db, nil
}
