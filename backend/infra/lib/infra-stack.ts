import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new s3.Bucket(this , "PropertyManagementSystemBucket", {
      bucketName: "property-management-system-homify-bucket",
      publicReadAccess: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
    });

    new cdk.CfnOutput(this, "BucketName", {
      value: bucket.bucketName,
      description: "The name of the S3 bucket for the Property Management System",
    });
  }
}
