package tecnm.equipo4.barberoApi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import tecnm.equipo4.barberoApi.models.Cliente;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
}
