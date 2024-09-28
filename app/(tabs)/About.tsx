import { View } from "react-native";
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState } from "react";
import { Text, Button, StyleSheet, TouchableOpacity, Modal, Pressable } from "react-native";
import QRCode from 'react-native-qrcode-svg';

interface BarcodeData {
  data: string;
}

const About: React.FC = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [isScanned, setIsScanned] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.mainContainer}>
        <Text style={styles.permissionMessage}>Permiso para usar la cámara es requerido</Text>
        <Button onPress={requestPermission} title="Conceder Permiso" />
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }: BarcodeData) => {
    setScannedResult(data);
    setIsScanned(true);
    setIsCameraOpen(false);
  };

  const toggleCamera = () => {
    setIsCameraOpen((prev) => !prev);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.qrCodeCont}>
        <QRCode
          value="HOLA! SOY ZAREK :D"
          size={200}
          backgroundColor='white'
          color='black'
        />
      </View>
      <Button onPress={toggleCamera} title={isCameraOpen ? "Cerrar cámara" : "Abrir cámara"} />

      {isCameraOpen && (
        <CameraView
          style={styles.cameraContainer}
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        />
      )}

      {isScanned && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={isScanned}
          onRequestClose={() => {
            setIsScanned(false);
          }}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Scanned: {scannedResult}</Text>
              <Pressable
                style={[styles.cameraButton, styles.closeButton]}
                onPress={() => setIsScanned(false)}
              >
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton:{},
  permissionMessage: {
    textAlign: 'center',
    paddingBottom: 10,
    fontSize: 18,
    color: '#333',
  },
  qrCodeCont: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 10,
  },
  cameraContainer: {
    width: 300,
    height: 400,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', 
  },
  modalContent: {
    width: 300, 
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'white', 
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#2196F3',
    margin: 10,
    padding: 10,
    borderRadius: 4,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default About;
