package com.akhadua.sambalpuri;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(com.getcapacitor.community.fcm.FCMPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
