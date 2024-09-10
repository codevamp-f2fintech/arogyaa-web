import { useState } from 'react';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';

const PhoneAuth: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [verificationId, setVerificationId] = useState<string>('');

  const setupRecaptcha = () => {
    const auth = getAuth();
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);
    window.recaptchaVerifier.render();
  };

  const handleSendCode = async () => {
    setupRecaptcha();
    const auth = getAuth();
    const appVerifier = window.recaptchaVerifier;

    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setVerificationId(confirmationResult.verificationId);
    } catch (error) {
      console.error('Error during phone sign-in', error);
    }
  };

  const handleVerifyCode = async () => {
    const auth = getAuth();
    try {
      const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
      await signInWithCredential(auth, credential);
    } catch (error) {
      console.error('Error verifying code', error);
    }
  };

  return (
    <div>
      <div id="recaptcha-container"></div>
      <input
        type="text"
        placeholder="Phone number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <button onClick={handleSendCode}>Send Code</button>

      <input
        type="text"
        placeholder="Verification code"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
      />
      <button onClick={handleVerifyCode}>Verify Code</button>
    </div>
  );
};

export default PhoneAuth;
