#!/usr/bin/env node

/**
 * JIRA Connection Test Script
 * Tests JIRA API connectivity independently
 */

import fetch from 'node-fetch';

const JIRA_CONFIG = {
  baseUrl: "https://banashreerautray.atlassian.net",
  email: "banashree.rautray@gmail.com", 
  apiToken: "ATATT3xFfGF0fBcD5NVFxq4U9uWAlHAurNQY2b4p3-0-pA5SZQoQERryxRdJED3tKO2T_K9wsBc4YPaF5TFSiFtYPQKLZ5hWXFKxstv6CZID9FotXVUoSxhLJkAzunXdHK36m3sFO6iy12fvERdxCsMemblqx1T1f_3ejFVGPuXorWFPH6odXf4=C09DEE21",
  projectKey: "DEV"
};

async function testJiraConnection() {
  console.log('🧪 Testing JIRA API Connection...');
  console.log(`📍 Base URL: ${JIRA_CONFIG.baseUrl}`);
  console.log(`📧 Email: ${JIRA_CONFIG.email}`);
  console.log(`🔑 Project: ${JIRA_CONFIG.projectKey}`);
  console.log();

  const credentials = Buffer.from(`${JIRA_CONFIG.email}:${JIRA_CONFIG.apiToken}`).toString('base64');

  // Test 1: Check project existence
  try {
    console.log('🔍 Test 1: Checking project access...');
    const projectUrl = `${JIRA_CONFIG.baseUrl}/rest/api/3/project/${JIRA_CONFIG.projectKey}`;
    const response = await fetch(projectUrl, {
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      const project = await response.json();
      console.log(`✅ Project found: ${project.name} (${project.key})`);
    } else {
      const error = await response.text();
      console.error(`❌ Project access failed: ${response.status} - ${error}`);
    }
  } catch (error) {
    console.error(`❌ Project test error: ${error.message}`);
  }

  // Test 2: Search for issues
  try {
    console.log('\n🔍 Test 2: Searching for issues...');
    const searchUrl = `${JIRA_CONFIG.baseUrl}/rest/api/3/search/jql`;
    const searchResponse = await fetch(searchUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        jql: `project = ${JIRA_CONFIG.projectKey}`,
        maxResults: 5,
        fields: ['summary', 'status']
      })
    });

    if (searchResponse.ok) {
      const result = await searchResponse.json();
      const total = result.total ?? result.issues?.length ?? 0;
      console.log(`✅ Search successful: Found ${total} issues`);
      
      if (result.issues?.length > 0) {
        console.log('📋 Recent issues:');
        result.issues.forEach(issue => {
          console.log(`   ${issue.key}: ${issue.fields.summary}`);
        });
      } else {
        console.log('📝 No issues found in project');
      }
    } else {
      const error = await searchResponse.text();
      console.error(`❌ Search failed: ${searchResponse.status} - ${error}`);
    }
  } catch (error) {
    console.error(`❌ Search test error: ${error.message}`);
  }

  // Test 3: Check DEV-1 and DEV-2 specifically
  console.log('\n🔍 Test 3: Checking specific issues...');
  
  for (const issueKey of ['DEV-1', 'DEV-2']) {
    try {
      const issueUrl = `${JIRA_CONFIG.baseUrl}/rest/api/3/issue/${issueKey}`;
      const issueResponse = await fetch(issueUrl, {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Accept': 'application/json'
        }
      });

      if (issueResponse.ok) {
        const issue = await issueResponse.json();
        console.log(`✅ ${issueKey} exists: ${issue.fields.summary}`);
      } else if (issueResponse.status === 404) {
        console.log(`❌ ${issueKey} does not exist`);
      } else {
        const error = await issueResponse.text();
        console.error(`❌ ${issueKey} check failed: ${issueResponse.status} - ${error}`);
      }
    } catch (error) {
      console.error(`❌ ${issueKey} test error: ${error.message}`);
    }
  }

  console.log('\n🏁 JIRA connection test completed!');
}

testJiraConnection().catch(console.error);