# Backend Configuration for The Free Website Wizards

## Overview
This document outlines the backend setup for handling form submissions, Google Sheets integration, and email notifications.

## Architecture
- **Frontend**: HTML form with JavaScript submission handling
- **Backend**: Google Apps Script (serverless)
- **Database**: Google Sheets ("Website Submissions" sheet)
- **Email**: Gmail via Google Apps Script MailApp

## Google Apps Script Setup

### 1. Apps Script Deployment
The Apps Script is located in `appsscript.js` and needs to be deployed as a web app:

1. Go to [Google Apps Script](https://script.google.com)
2. Create a new project or open existing one
3. Copy the contents of `appsscript.js` into the script editor
4. Deploy as web app:
   - Execute as: Me
   - Who has access: Anyone
   - Copy the deployment URL

### 2. Current Configuration
- **Sheet ID**: `1batVITcT526zxkc8Qdf0_AKbORnrLRB7-wHdDKhcm9M`
- **Sheet Name**: `Website Submissions`
- **Notification Email**: `dylan@thefreewebsitewizards.com`
- **Current Deployment URL**: `https://script.google.com/macros/s/AKfycbyWKY5Z-NhmmHSt-OWM7pZ84kgPLsNDiX5rX-QCzGuIp_KA80i7T3y3Y0CJE82FcRM3/exec`

### 3. Google Sheets Structure
The "Website Submissions" sheet should have the following columns:
1. Timestamp
2. First Name
3. Email
4. Phone Number
5. Country Code
6. Country Name
7. Has Web Hosting
8. Website Name (placeholder)
9. Website Description
10. Source

## Form Submission Flow

1. **User fills form** on website
2. **JavaScript validation** checks required fields
3. **Form data sent** to Google Apps Script via POST request
4. **Apps Script processes** data and validates
5. **Data saved** to Google Sheets
6. **Email notifications sent**:
   - Owner notification to `dylan@thefreewebsitewizards.com`
   - Confirmation email to applicant
7. **Success response** sent back to frontend

## Email Templates

### Owner Notification
- Subject: "🚀 New Website Application from [Name]"
- HTML formatted with application details
- Direct link to Google Sheets

### Applicant Confirmation
- Subject: "✨ Thanks [Name]! Your Free Website Application is Received"
- Professional HTML template with:
  - Application summary
  - Next steps timeline
  - Contact information
  - Pro tips

## Error Handling

### Frontend
- Field validation before submission
- Retry logic (up to 3 attempts)
- User-friendly error messages
- Loading states and button disabling

### Backend (Apps Script)
- Input validation and sanitization
- Email format validation
- Graceful error handling
- Detailed logging
- Separate error handling for emails vs data storage

## Security Features

1. **Input Sanitization**: All data cleaned before storage
2. **Email Validation**: Regex validation for email format
3. **Required Field Validation**: Server-side validation
4. **Error Isolation**: Email failures don't break form submission
5. **CORS Handling**: FormData used to avoid preflight requests

## Monitoring & Logging

- All operations logged in Apps Script console
- Separate success/error logging for:
  - Data storage
  - Owner notifications
  - Applicant confirmations

## Deployment Checklist

- [ ] Apps Script deployed with correct permissions
- [ ] Google Sheets created with proper structure
- [ ] Email addresses configured correctly
- [ ] Frontend pointing to correct Apps Script URL
- [ ] Test submission end-to-end
- [ ] Verify email delivery (check spam folders)
- [ ] Monitor Apps Script logs for errors

## Troubleshooting

### Common Issues
1. **403 Forbidden**: Check Apps Script permissions
2. **Email not received**: Check spam folder, verify email address
3. **Data not in sheets**: Check sheet name and ID
4. **CORS errors**: Ensure using FormData, not JSON

### Testing
Use browser developer tools to monitor:
- Network requests
- Console logs
- Response status codes

## Maintenance

### Regular Tasks
- Monitor Google Sheets for new submissions
- Check Apps Script execution logs
- Verify email delivery rates
- Update email templates as needed

### Updates
When updating the Apps Script:
1. Test in development first
2. Deploy new version
3. Update frontend URL if needed
4. Test complete flow