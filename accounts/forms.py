from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from accounts.models import CustomUser
from django.forms.widgets import PasswordInput, TextInput
from django.contrib.auth.models import User
from django.core.validators import validate_email
from django.core.validators import RegexValidator


class CustomUserCreationForm(UserCreationForm):
    name = forms.CharField(
        max_length=100, 
        required=True, 
        help_text="Enter your name", 
        widget=forms.TextInput(attrs={'placeholder':'Name'})
    )
    phonenumber = forms.CharField(
        max_length=15, 
        required=True,
        help_text='Enter your phone number',
        widget=forms.TextInput(attrs={'placeholder': 'Phone Number'})
    )
    email = forms.EmailField(
        required=True,
        help_text='Enter a valid email address',
        widget=forms.EmailInput(attrs={'placeholder': 'Email Address'}),
        validators=[validate_email]
    )
    message = forms.CharField(
        required=False,  
        help_text='Enter your message (optional)',
        widget=forms.Textarea(attrs={
            'placeholder': 'Your Message',
            'rows': 4,
            'style': 'resize: vertical;'
        })
    )
    password1 = forms.CharField(
        widget=forms.PasswordInput(attrs={'placeholder': 'Password'}),
        help_text='Enter a strong password'
    )
    password2 = forms.CharField(
        widget=forms.PasswordInput(attrs={'placeholder': 'Confirm Password'}),
        help_text='Repeat the password'
    )

    class Meta:
        model = CustomUser
        fields = ['name', 'email', 'phonenumber', 'message', 'password1', 'password2']

    def clean_name(self):
        name = self.cleaned_data.get('name')
        # Check if username (name) exists, ignoring case
        if CustomUser.objects.filter(username__iexact=name).exists():
            raise forms.ValidationError("This username is already in use.")
        return name

    def clean_email(self):
        email = self.cleaned_data.get('email')
        # Normalize the email (convert to lowercase)
        email = email.lower().strip()
        
        # Check if email exists, ignoring case
        if CustomUser.objects.filter(email__iexact=email).exists():
            raise forms.ValidationError("This email is already in use.")
        return email

    def clean_phonenumber(self):
        phone = self.cleaned_data.get('phonenumber')
        # Remove any non-digit characters
        phone = ''.join(filter(str.isdigit, phone))
        
        if CustomUser.objects.filter(phonenumber=phone).exists():
            raise forms.ValidationError("This phone number is already in use.")
        return phone

    def clean(self):
        cleaned_data = super().clean()
        
        # Ensure passwords match
        password1 = cleaned_data.get('password1')
        password2 = cleaned_data.get('password2')
        
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError({
                'password2': 'Passwords do not match.'
            })
        
        return cleaned_data

    def save(self, commit=True):
        # Normalize email before saving
        user = super().save(commit=False)
        user.email = self.cleaned_data['email'].lower().strip()
        user.username = self.cleaned_data.get('name')  # Set username as name
        
        if commit:
            user.save()
        return user


class CustomLoginForm(forms.Form):  
    email = forms.EmailField(
        required=True,
        label='Email',  # Added label
        widget=forms.EmailInput(attrs={
            'placeholder': 'Email Address',
            'class': 'form-control',
            'name': 'email',  # Added name attribute
            'id': 'email',    # Added id attribute
        })
    )
    password = forms.CharField(
        required=True,
        label='Password',  # Added label
        widget=forms.PasswordInput(attrs={
            'placeholder': 'Password',
            'class': 'form-control',
            'name': 'password',  # Added name attribute
            'id': 'password',    # Added id attribute
        })
    )
    

class CustomStaffCreationForm(UserCreationForm):
    name = forms.CharField(
        max_length=100, 
        required=True, 
        help_text="Enter your name", 
        widget=forms.TextInput(attrs={'placeholder':'Name'})
    )
    phonenumber = forms.CharField(
        max_length=15, 
        required=True,
        help_text='Enter your phone number',
        widget=forms.TextInput(attrs={'placeholder': 'Phone Number'})
    )
    email = forms.EmailField(
        required=True,
        help_text='Enter a valid email address',
        widget=forms.EmailInput(attrs={'placeholder': 'Email Address'}),
        validators=[validate_email]
    )
    address = forms.CharField(
        required=True,
        help_text="Enter a valid address",
        widget=forms.TextInput(attrs={'placeholder':'Address'}),
        
    )
    password1 = forms.CharField(
        widget=forms.PasswordInput(attrs={'placeholder': 'Password'}),
        help_text='Enter a strong password'
    )
    password2 = forms.CharField(
        widget=forms.PasswordInput(attrs={'placeholder': 'Confirm Password'}),
        help_text='Repeat the password'
    )

    class Meta:
        model = CustomUser
        fields = ['email', 'phonenumber',  'address', 'password1', 'password2']
    
    def clean_name(self):
        name = self.cleaned_data.get('name')
        # Check if username (name) exists, ignoring case
        if CustomUser.objects.filter(username__iexact=name).exists():
            raise forms.ValidationError("This username is already in use.")
        return name

    def clean_email(self):
        email = self.cleaned_data.get('email')
        # Normalize the email (convert to lowercase)
        email = email.lower().strip()
        
        # Check if email exists, ignoring case
        if CustomUser.objects.filter(email__iexact=email).exists():
            raise forms.ValidationError("This email is already in use.")
        return email

    def clean_phonenumber(self):
        phone = self.cleaned_data.get('phonenumber')
        # Remove any non-digit characters
        phone = ''.join(filter(str.isdigit, phone))
        
        if CustomUser.objects.filter(phonenumber=phone).exists():
            raise forms.ValidationError("This phone number is already in use.")
        return phone

    def clean(self):
        cleaned_data = super().clean()
        
        # Ensure passwords match
        password1 = cleaned_data.get('password1')
        password2 = cleaned_data.get('password2')
        
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError({
                'password2': 'Passwords do not match.'
            })
        
        return cleaned_data

    def save(self, commit=True):
        # Normalize email before saving
        user = super().save(commit=False)
        user.email = self.cleaned_data['email'].lower().strip()
        user.username = self.cleaned_data.get('name') 
        # user.username = user.email  # Set username as lowercase email

        
        if commit:
            user.save()
        return user
        



