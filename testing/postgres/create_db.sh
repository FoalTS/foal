#!/bin/env bash
psql -U postgres -c "CREATE DATABASE foal_sequelize_test OWNER postgres"
psql -U postgres -c "CREATE DATABASE foal_examples OWNER postgres"