#!/bin/sh

aws cloudformation package --template-file root.json --output-template packaged.yaml --s3-bucket cloud-formation-xianbridal && \
aws s3 cp packaged.yaml s3://cloud-formation-xianbridal
