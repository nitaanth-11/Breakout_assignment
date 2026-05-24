// ── LocationMap: Leaflet.js map via WebView ─────────────────────────────────
// Light Voyager-themed interactive map with clean slate-blue details.

import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import LOCATIONS from '../../constants/locations';
import COLORS from '../../constants/colors';
import { BORDER_RADIUS } from '../../constants/spacing';

function getLeafletHTML(location) {
  const loc = LOCATIONS[location];
  const [lat, lng] = loc.coords;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #F8FAFC; }
        #map { width: 100%; height: 100vh; border-radius: 14px; }
        .custom-popup .leaflet-popup-content-wrapper {
          background: #FFFFFF;
          color: #0F172A;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.1), 0 8px 10px -6px rgba(37, 99, 235, 0.1);
        }
        .custom-popup .leaflet-popup-tip { background: #FFFFFF; }
        .custom-popup .leaflet-popup-content {
          margin: 14px 16px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-size: 13px;
          line-height: 1.5;
        }
        .popup-name {
          font-weight: 700;
          font-size: 14px;
          color: #2563EB;
          margin-bottom: 6px;
        }
        .popup-address { color: #475569; margin-bottom: 4px; }
        .popup-timings { color: #10B981; font-weight: 500; }
        .popup-phone { color: #2563EB; font-weight: 600; margin-top: 4px; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', {
          zoomControl: false,
          attributionControl: false
        }).setView([${lat}, ${lng}], 15);

        // Light elegant Voyager maps with subtle blue water paths
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          maxZoom: 19
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        var marker = L.marker([${lat}, ${lng}]).addTo(map);

        marker.bindPopup(
          '<div class="popup-name">${loc.name}</div>' +
          '<div class="popup-address">📍 ${loc.address}</div>' +
          '<div class="popup-timings">🕐 ${loc.timings}</div>' +
          '<div class="popup-phone">📞 ${loc.phone}</div>',
          { className: 'custom-popup', maxWidth: 280 }
        ).openPopup();

        // Listen for location changes from React Native
        document.addEventListener('message', function(e) {
          try {
            var data = JSON.parse(e.data);
            map.flyTo([data.lat, data.lng], 15, { duration: 1.5 });
            marker.setLatLng([data.lat, data.lng]);
            marker.setPopupContent(
              '<div class="popup-name">' + data.name + '</div>' +
              '<div class="popup-address">📍 ' + data.address + '</div>' +
              '<div class="popup-timings">🕐 ' + data.timings + '</div>' +
              '<div class="popup-phone">📞 ' + data.phone + '</div>'
            );
            marker.openPopup();
          } catch(err) {}
        });

        // Also handle window.addEventListener for web
        window.addEventListener('message', function(e) {
          try {
            var data = JSON.parse(e.data);
            map.flyTo([data.lat, data.lng], 15, { duration: 1.5 });
            marker.setLatLng([data.lat, data.lng]);
            marker.setPopupContent(
              '<div class="popup-name">' + data.name + '</div>' +
              '<div class="popup-address">📍 ' + data.address + '</div>' +
              '<div class="popup-timings">🕐 ' + data.timings + '</div>' +
              '<div class="popup-phone">📞 ' + data.phone + '</div>'
            );
            marker.openPopup();
          } catch(err) {}
        });
      </script>
    </body>
    </html>
  `;
}

export default function LocationMap({ selectedLocation = 'mumbai' }) {
  const webViewRef = useRef(null);
  const prevLocation = useRef(selectedLocation);

  useEffect(() => {
    if (prevLocation.current !== selectedLocation && webViewRef.current) {
      const loc = LOCATIONS[selectedLocation];
      const payload = JSON.stringify({
        lat: loc.coords[0],
        lng: loc.coords[1],
        name: loc.name,
        address: loc.address,
        timings: loc.timings,
        phone: loc.phone,
      });
      webViewRef.current.postMessage(payload);
      prevLocation.current = selectedLocation;
    }
  }, [selectedLocation]);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <iframe
          srcDoc={getLeafletHTML(selectedLocation)}
          style={{ width: '100%', height: '100%', border: 'none', borderRadius: 14 }}
          title="Breakout Location Map"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: getLeafletHTML(selectedLocation) }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scrollEnabled={false}
        originWhitelist={['*']}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 280,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  webview: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
