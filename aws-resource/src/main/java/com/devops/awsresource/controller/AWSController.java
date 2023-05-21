package com.devops.awsresource.controller;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.ec2.AmazonEC2;
import com.amazonaws.services.ec2.AmazonEC2ClientBuilder;
import com.amazonaws.services.ec2.model.*;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;


import java.util.ArrayList;

import java.util.List;

import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/data")
@RestController
public class AWSController {

    @Value("${jenkins.url}")
    private String jenkinsUrl;

    @Value("${jenkins.username}")
    private String jenkinsUsername;

    @Value("${jenkins.password}")
    private String jenkinsPassword;

    @Value("${aws.accessKeyId}")
    private String accessKeyId;

    @Value("${aws.secretKey}")
    private String secretAccessKey;

    @Value("${aws.region}")
    private String region;






    @GetMapping("/get-instance-ids")
    public ResponseEntity<List<String>> getInstanceIds() {
        try {
            // Create a BasicAWSCredentials object with the access key ID and secret access key
            BasicAWSCredentials credentials = new BasicAWSCredentials(accessKeyId, secretAccessKey);

            // Create an EC2 client with the desired region
            AmazonEC2 ec2 = AmazonEC2ClientBuilder.standard()
                    .withCredentials(new AWSStaticCredentialsProvider(credentials))
                    .withRegion(region)
                    .build();


            // Retrieve information about all EC2 instances
            DescribeInstancesRequest request = new DescribeInstancesRequest();
            DescribeInstancesResult result = ec2.describeInstances(request);
            List<Reservation> reservations = result.getReservations();

            // Build a list of instance IDs
            List<String> instanceIds = reservations.stream()
                    .flatMap(reservation -> reservation.getInstances().stream())
                    .map(Instance::getInstanceId)
                    .collect(Collectors.toList());

            // Return the list of instance IDs
            return ResponseEntity.ok(instanceIds);
        } catch (Exception e) {
            // Return an error response
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/get-ami")
    public ResponseEntity<List<String>> getImages() {
        // Create a BasicAWSCredentials object with the access key ID and secret access key
        BasicAWSCredentials credentials = new BasicAWSCredentials(accessKeyId, secretAccessKey);

        AmazonEC2 ec2Client = AmazonEC2ClientBuilder.standard()
                .withRegion(region)
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .build();


        DescribeImagesRequest describeImagesRequest = new DescribeImagesRequest().withFilters(
                new Filter("is-public").withValues("true"));

        DescribeImagesResult describeImagesResult = ec2Client.describeImages(describeImagesRequest);
        List<String> images = describeImagesResult.getImages().stream()
                .map(image -> "Image ID: " + image.getImageId() + " OS: " + image.getName())
                .collect(Collectors.toList());

        return ResponseEntity.ok(images);

    }


    @GetMapping("/instance-types")
    public ResponseEntity<List<String>> getInstanceTypes() {
        // Create a BasicAWSCredentials object with the access key ID and secret access key
        BasicAWSCredentials credentials = new BasicAWSCredentials(accessKeyId, secretAccessKey);

        AmazonEC2 ec2Client = AmazonEC2ClientBuilder.standard()
                .withRegion(region)
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .build();

        // Create a DescribeInstanceTypesRequest
        DescribeInstanceTypesRequest request = new DescribeInstanceTypesRequest();

        // Call describeInstanceTypes() to retrieve all instance types
        DescribeInstanceTypesResult result = ec2Client.describeInstanceTypes(request);

        // Loop through the instance types and add their names to a list
        List<String> instanceTypes = new ArrayList<>();
        for (InstanceTypeInfo typeInfo : result.getInstanceTypes()) {
            instanceTypes.add(typeInfo.getInstanceType());
        }

        // Return the list of instance types in the HTTP response
        return ResponseEntity.ok(instanceTypes);
    }

    @GetMapping("/regions")
    public ResponseEntity<List<String>> getRegions() {
        // Create a BasicAWSCredentials object with the access key ID and secret access key
        BasicAWSCredentials credentials = new BasicAWSCredentials(accessKeyId, secretAccessKey);

        AmazonEC2 ec2Client = AmazonEC2ClientBuilder.standard()
                .withRegion(region)
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .build();

        // Create a DescribeRegionsRequest
        DescribeRegionsRequest request = new DescribeRegionsRequest();

        // Call describeRegions() to retrieve all regions
        DescribeRegionsResult result = ec2Client.describeRegions(request);

        // Loop through the regions and add their names to a list
        List<String> regions = new ArrayList<>();
        for (Region region : result.getRegions()) {
            regions.add(region.getRegionName());
        }

        // Return the list of regions in the HTTP response
        return ResponseEntity.ok(regions);
    }


    @PostMapping("/trigger-jenkins-build")
    public ResponseEntity<String> triggerJenkinsBuild(@RequestParam(name = "NAME") String name,
                                                      @RequestParam(name = "REGION") String region,
                                                      @RequestParam(name = "AMI") String ami,
                                                      @RequestParam(name = "INSTANCE_TYPE") String instanceType,
                                                      @RequestParam(name = "ACCOUNT") String account,
                                                      @RequestParam(name = "APP") String app,
                                                      @RequestParam(name = "ACTION") String action) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = String.format(jenkinsUrl+
                    "?NAME=%s&REGION=%s&AMI=%s&INSTANCE_TYPE=%s&ACCOUNT=%s&APP=%s&ACTION=%s"
                    , name, region, ami ,instanceType ,account ,app ,action);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.setBasicAuth(jenkinsUsername, jenkinsPassword);
            HttpEntity<String> entity = new HttpEntity<>("parameters", headers);
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, entity, String.class);
            System.out.println(url+" ssssss");

            // Return a success response
            return ResponseEntity.ok("Jenkins job triggered successfully"+response);
        } catch (Exception e) {
            // Return an error response
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error triggering Jenkins job: " + e.getMessage());
        }

    }


    }

