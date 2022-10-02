package main

import (
	"log"
	"net/http"
	"os"
	"github.com/gorilla/mux"
	"mainbackend/graph"
	"mainbackend/graph/model"
	"mainbackend/graph/generated"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"mainbackend/database"
)

const defaultPort = "8080"

func MyCors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	 w.Header().Set("Access-Control-Allow-Origin", "*")
	 w.Header().Add("Access-Control-Allow-Headers", "Content-Type,AccessToken,X-CSRF-Token, Authorization, Token")
	 w.Header().Add("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	 w.Header().Set("content-type", "application/json;charset=UTF-8")
	 if r.Method == "OPTIONS" {
	  w.WriteHeader(http.StatusNoContent)
	  return
	 }
	 next.ServeHTTP(w, r)
	})
   }


func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	db := database.GetDB()
	
	db.AutoMigrate(&model.User{})
	router := mux.NewRouter();
	router.Use(MyCors);
	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{
		DB: db,
	}}))

	router.Handle("/", playground.Handler("GraphQL playground", "/query"))
	router.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}
