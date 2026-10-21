package tecnm.equipo4.barberoApi.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import tecnm.equipo4.barberoApi.models.Cliente;

import java.util.Optional;

public interface ClienteRepository extends CrudRepository<Cliente, Long> {
    Optional<Cliente> findByEmailAndPassword(String email, String password);
}