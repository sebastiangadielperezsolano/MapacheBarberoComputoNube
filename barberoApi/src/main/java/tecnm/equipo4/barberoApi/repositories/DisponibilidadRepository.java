package tecnm.equipo4.barberoApi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import tecnm.equipo4.barberoApi.models.DisponibilidadBarbero;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DisponibilidadRepository extends JpaRepository<DisponibilidadBarbero, Long> {
    List<DisponibilidadBarbero> findByBarbero_IdBarberoAndDia(Long idBarbero, LocalDate dia);
}