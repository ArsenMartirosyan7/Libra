package com.bl.mb.service;

import com.bl.mb.models.Locker;

import java.util.List;
import java.util.UUID;

public interface LockerService {

    List<Locker> getAllLockers();

    Locker getLockerById(UUID id);

    Locker createLocker(Locker locker);

    String assignLocker(UUID lockerId, UUID userId);

    String freeLocker(UUID lockerId);

    boolean openLocker(UUID lockerId);
}
