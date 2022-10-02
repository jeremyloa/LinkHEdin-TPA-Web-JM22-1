package database

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

func GetDB() *gorm.DB {
	if db == nil {
		dsn := "host=localhost user=postgres password=postgres dbname=linkhedin port=5000 sslmode=disable TimeZone=Asia/Shanghai"
		tempdb, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err != nil {panic(err)}
		db = tempdb
	}
	return db
}