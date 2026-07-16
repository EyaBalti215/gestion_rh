package com.gestionrh.backend.service;

import com.gestionrh.backend.Entity.Notification;
import com.gestionrh.backend.Repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification createNotification(String titre, String description, String categorie) {
        Notification notification = new Notification(titre, description, categorie);
        return notificationRepository.save(notification);
    }

    @Transactional(readOnly = true)
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAllByOrderByDateCreationDesc();
    }

    public Notification markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notification introuvable"));
        notification.setLu(true);
        return notificationRepository.save(notification);
    }

    public void markAllAsRead() {
        List<Notification> notifications = notificationRepository.findAllByOrderByDateCreationDesc();
        notifications.forEach(notification -> notification.setLu(true));
        notificationRepository.saveAll(notifications);
    }

    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }
}
