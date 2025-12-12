package com.bl.mb.service;

import com.bl.mb.models.Locker;
import com.bl.mb.models.User;
import com.bl.mb.repo.LockerRepository;
import com.bl.mb.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.fazecast.jSerialComm.SerialPort;


import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LockerServiceImpl implements LockerService {

    private final LockerRepository lockerRepository;
    private final UserRepository userRepository;

    @Override
    public List<Locker> getAllLockers() {
        return lockerRepository.findAll();
    }

    @Override
    public Locker getLockerById(UUID id) {
        return lockerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Locker not found"));
    }

    @Override
    public Locker createLocker(Locker locker) {
        return lockerRepository.save(locker);
    }

    @Override
    public String assignLocker(UUID lockerId, UUID userId) {

        Locker locker = lockerRepository.findById(lockerId)
                .orElseThrow(() -> new RuntimeException("Locker not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!locker.isAvailable()) {
            return "Locker is already in use";
        }

        locker.setAvailable(false);
        locker.setUser(user);

        lockerRepository.save(locker);
        return "Locker assigned successfully";
    }

    @Override
    public String freeLocker(UUID lockerId) {

        Locker locker = lockerRepository.findById(lockerId)
                .orElseThrow(() -> new RuntimeException("Locker not found"));

        locker.setUser(null);
        locker.setAvailable(true);

        lockerRepository.save(locker);
        return "Locker freed successfully";
    }

    public boolean openLocker(UUID lockerId) {
        System.out.println("Attempting to open locker: " + lockerId);

        SerialPort port = SerialPort.getCommPort("COM3");
        port.setBaudRate(9600);

        if (port.openPort()) {
            System.out.println("Serial port opened successfully!");
            try {
                String command = "OPEN\n";  // <-- SEND ONLY "OPEN"
                port.getOutputStream().write(command.getBytes());
                port.getOutputStream().flush();
                System.out.println("Command sent to Arduino: " + command.trim());
                return true;
            } catch (Exception e) {
                e.printStackTrace();
                System.out.println("Failed to send command to Arduino for locker: " + lockerId);
            } finally {
                port.closePort();
                System.out.println("Serial port closed.");
            }
        } else {
            System.out.println("Failed to open serial port: " + port.getSystemPortName());
        }

        return false;
    }


}



