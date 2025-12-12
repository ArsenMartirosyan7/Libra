package com.bl.mb.controller;

import com.bl.mb.models.Locker;
import com.bl.mb.service.LockerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/lockers")
@RequiredArgsConstructor
@CrossOrigin
public class LockerController {

    private final LockerService lockerService;

    // ✅ Get all lockers
    @GetMapping
    public ResponseEntity<List<Locker>> getAllLockers() {
        return ResponseEntity.ok(lockerService.getAllLockers());
    }

    // ✅ Get locker by ID
    @GetMapping("/{id}")
    public ResponseEntity<Locker> getLockerById(@PathVariable UUID id) {
        return ResponseEntity.ok(lockerService.getLockerById(id));
    }

    // ✅ Create new locker
    @PostMapping
    public ResponseEntity<Locker> createLocker(@RequestBody Locker locker) {
        return ResponseEntity.ok(lockerService.createLocker(locker));
    }

    // ✅ Assign locker to user
    @PutMapping("/{lockerId}/assign/{userId}")
    public ResponseEntity<String> assignLocker(
            @PathVariable UUID lockerId,
            @PathVariable UUID userId
    ) {
        return ResponseEntity.ok(lockerService.assignLocker(lockerId, userId));
    }

    // ✅ Free locker
    @PutMapping("/{lockerId}/free")
    public ResponseEntity<String> freeLocker(@PathVariable UUID lockerId) {
        return ResponseEntity.ok(lockerService.freeLocker(lockerId));
    }

    // ✅ Open locker via button
    @PostMapping("/open")
    public ResponseEntity<String> openLocker() {
        UUID lockerId = UUID.fromString("3d6dcd9e-87fa-49f5-81f9-fc382f7c8ebb");

        System.out.println("Received request to open locker: " + lockerId);

        boolean success = lockerService.openLocker(lockerId);

        if (success) {
            System.out.println("Command sent successfully to Arduino for locker: " + lockerId);
            return ResponseEntity.ok("Locker opened!");
        } else {
            System.out.println("Failed to send command to Arduino for locker: " + lockerId);
            return ResponseEntity.status(500).body("Failed to open locker");
        }
    }

}
