from django.core.mail import send_mail
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
import logging


logger = logging.getLogger(__name__)

def send_email_barksbean(recipient_email, password):
    """
    Send a test email to the specified recipient
    
    Args:
        recipient_email (str): Email address of the recipient
    
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        # Validate email address
        validate_email(recipient_email)
        
        # Email configuration
        subject = 'Welcome to Staff Registration'
        message = f'''
        Dear Staff Member,

        Your account has been successfully created.
        Password: {password}
        Best regards,
        Barks & Bean Team
        '''
        
        from_email = 'mm3@3m-technology.com'
        recipient_list = [recipient_email]  # Must be a list or tuple

        # Send email
        send_mail(subject, message, from_email, recipient_list, fail_silently=False, )
        
        logger.info(f"Email sent successfully to {recipient_email}")
        return True
    
    except ValidationError:
        logger.error(f"Invalid email address: {recipient_email}")
        return False
    
    except Exception as e:
        logger.error(f"Email sending failed: {str(e)}")
        return False
    
