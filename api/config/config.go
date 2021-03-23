package config

import (
	"encoding/json"
	"io/ioutil"
)

type Config struct {
	Server struct {
		Port string `json:"port"`
	} `json:"server"`
}

func FromFile(path string) (*Config, error) {
	b, err := ioutil.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var cfg Config
	if err := json.Unmarshal(b, &cfg); err != nil {
		return nil, err
	}

	return &cfg, nil
}
