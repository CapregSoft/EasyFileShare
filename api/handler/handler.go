package handler

import (
	"net/http"

	"github.com/labstack/echo"
)

func Ping(c echo.Context) error {
	return c.JSON(http.StatusOK, "Pong")
}

func CreateLink(c echo.Context) error {
	return c.JSON(http.StatusOK, "OK")
}

func GetLink(c echo.Context) error {
	return c.JSON(http.StatusOK, "OK")
}

func GetLinkStats(c echo.Context) error {
	return c.JSON(http.StatusOK, "OK")
}
