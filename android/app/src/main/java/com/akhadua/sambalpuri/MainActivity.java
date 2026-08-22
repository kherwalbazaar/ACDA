package com.akhadua.sambalpuri;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.community.fcm.FCMPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        registerPlugin(FCMPlugin.class);
    }
}
