# `@f2f/storage`

> TODO: description

## Usage

```
const storage = require('@f2f/storage');

// TODO: DEMONSTRATE API
```

### steps

1. add sequelize, mysql2
2. 创建数据库
3. 写 sequelize 格式的 models 或 直接在数据库中添加表


### tips
1. 数据库表与 model 可相互生成
   1. 已经创建好数据库表时，可使用 sequelize-auto 来生成 models，具体命令 ```sequelize-auto -o "[./models]" -d [database] -h localhost -u [user] -x [password]```，其中 [] 内的内容为可替换部分。
   2. 已写好 models 文件时，可使用 sequelize.flush 来自动生成数据库表，参见 table-generator.js
