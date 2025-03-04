// Package utils (config) defines utility for parsing environment
// variables.
package utils

import (
	"time"

	"github.com/spf13/viper"
)

// A Config stores configurations or environment variables
type Config struct {
	DBDriver             string        `mapstructure:"DB_DRIVER"`
	Environment          string        `mapstructure:"ENVIRONMENT"`
	DBSource             string        `mapstructure:"DB_SOURCE"`
	EmailSenderAddress   string        `mapstructure:"EMAIL_SENDER_ADDRESS"`
	EmailSenderName      string        `mapstructure:"EMAIL_SENDER_NAME"`
	EmailSenderPassword  string        `mapstructure:"EMAIL_SENDER_PASSWORD"`
	RedisAddress         string        `mapstructure:"REDIS_ADDRESS"`
	HTTPServerAddress    string        `mapstructure:"HTTP_SERVER_ADDRESS"`
	TokenSymmetricKey    string        `mapstructure:"TOKEN_SYMMETRIC_KEY"`
	AccessTokenDuration  time.Duration `mapstructure:"ACCESS_TOKEN_DURATION"`
	RefreshTokenDuration time.Duration `mapstructure:"REFRESH_TOKEN_DURATION"`
	GoogleClientID       string        `mapstructure:"GOOGLE_CLIENT_ID"`
	GoogleClientSecret   string        `mapstructure:"GOOGLE_CLIENT_SECRET"`
	GoogleRedirectURL    string        `mapstructure:"GOOGLE_REDIRECT_URL"`
	GoogleRandomString   string        `mapstructure:"GOOGLE_RANDOM_STRING"`
	CorsTrustedOrigins   []string      `mapstructure:"CORS_TRUSTED_ORIGINS"`
}

// LoadConfig parses configuration file or environment variables
func LoadConfig(path string) (config Config, err error) {
	viper.AddConfigPath(path)
	viper.SetConfigName("app")
	viper.SetConfigType("env")

	viper.AutomaticEnv()

	err = viper.ReadInConfig()
	if err != nil {
		return
	}

	err = viper.Unmarshal(&config)
	return
}
