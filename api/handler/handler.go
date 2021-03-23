package handler

import (
	"net/http"

	"github.com/labstack/echo"
)

func Ping(c echo.Context) error {
	return c.JSON(http.StatusOK, "Pong")
}
