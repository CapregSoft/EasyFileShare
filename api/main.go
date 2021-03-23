package main

import (
	"log"

	"github.com/CapregSoft/EasyFileShare/api/handler"
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

func main() {
	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.RequestID())
	api := e.Group("/api/v1", serverHeader)
	api.GET("/ping", handler.Ping) // Returns all resources of this product

	err := e.Start(":9090")
	if err != nil {
		log.Fatal(err)
	}
}
func serverHeader(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		c.Response().Header().Set("x-version", "Test/v1.0")
		return next(c)
	}
}
