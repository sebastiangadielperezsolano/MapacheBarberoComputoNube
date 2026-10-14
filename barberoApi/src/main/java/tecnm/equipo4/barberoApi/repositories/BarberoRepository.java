package tecnm.equipo4.barberoApi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tecnm.equipo4.barberoApi.models.Barbero;

public interface BarberoRepository extends JpaRepository<Barbero, Long> {
}
